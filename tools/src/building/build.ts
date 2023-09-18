/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { spawn } from "child_process";
import { build as esbuild, Format } from "esbuild";
import { cp, mkdir, rm, stat, symlink, writeFile } from "fs/promises";
import { ignoreError } from "../util/errors.js";
import { Package } from "../util/package.js";
import { glob } from "glob";

export class Project {
    pkg: Package;

    constructor(path = ".") {
        Package.project = this.pkg = new Package({ path });
    }

    async buildSource(format: Format) {
        await this.build(format, "src", `dist/${format}`);
        await this.specifyFormat("dist", format);
    }

    async buildTests(format: Format) {
        await ignoreError("ENOENT", async () => {
            if ((await stat("test")).isDirectory()) {
                await this.build(format, "test", `build/${format}/test`);
            }
        });
        await ignoreError("EEXIST", async () => await symlink(`../../dist/${format}`, `build/${format}/src`));
        await this.specifyFormat("build", format);
    }

    async clean() {
        for (const dir of ["build", "dist"]) {
            await rm(dir, { recursive: true, force: true });
        }
    }

    async buildDeclarations() {
        // Would prefer to run in-process but tsc API would be far messier and
        // compilation is quite slow regardless
        await new Promise<void>((resolve, reject) => {
            const proc = spawn(
                "tsc",
                [
                    "-p",
                    this.pkg.resolve("tsconfig.json"),
                    "--outDir",
                    this.pkg.resolve("build/types"),
                    "--tsBuildInfoFile",
                    this.pkg.resolve("build/types/tsbuildinfo"),
                    "--sourceRoot",
                    "../../..",
                    "--emitDeclarationOnly",
                    "--sourceMap",
                    "--declarationMap",
                    "--incremental",
                ],
                {
                    stdio: "inherit",
                },
            );
            proc.on("error", reject);
            proc.on("close", code => {
                if (code !== 0) {
                    process.exit(code ?? -1);
                }
                resolve();
            });
        });
    }

    async installDeclarations() {
        await mkdir("dist", { recursive: true });
        if (this.pkg.esm) {
            await cp(`build/types/src`, `dist/esm`, { recursive: true, force: true });
        }
        if (this.pkg.cjs) {
            await cp(`build/types/src`, `dist/cjs`, { recursive: true, force: true });
        }
    }

    private async build(format: Format, indir: string, outdir: string) {
        const config = await ignoreError(
            "ERR_MODULE_NOT_FOUND",
            () => import(`${this.pkg.path}/build.config.js`)
        ) as Project.Config;

        await config?.before?.(this, format);

        const files = await glob(`${indir}/**/*.ts`);
        const entryPoints = files.map(file => ({
            in: file,
            out: `${file.slice(indir.length + 1).replace(/\.ts$/, "")}`
        }));
        await esbuild({
            entryPoints,
            outdir,
            format,
            sourcemap: true,
            absWorkingDir: this.pkg.path,
        });

        await config?.after?.(this, format);
    }

    private async specifyFormat(dir: string, format: Format) {
        if (format === "cjs") {
            await writeFile(`${dir}/${format}/package.json`, '{ "type": "commonjs" }');
        }
    }
}

export namespace Project {
    export interface Config {
        before?: (project: Project, format: Format) => Promise<void>;
        after?: (project: Project, format: Format) => Promise<void>;
    }
}
