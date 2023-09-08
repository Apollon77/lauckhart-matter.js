/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import colors from "ansi-colors";
import { glob } from "glob";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { Project } from "../building/build.js";
import { Package } from "../util/package.js";
import { testNode } from "./node.js";
import { ProgressReporter } from "./reporter.js";
import { testWeb } from "./web.js";

enum TestType {
    esm = "esm",
    cjs = "cjs",
    web = "web",
}

export async function main(argv = process.argv) {
    const testTypes = new Set<TestType>();

    let manual = false;

    const args = await yargs(hideBin(argv))
        .usage("Runs tests in packages adhering to matter.js standards.")
        .option("prefix", {
            alias: "p",
            default: ".",
            type: "string",
            describe: "specify directory of package to test",
        })
        .option("web", {
            alias: "w",
            default: false,
            type: "boolean",
            describe: "enable web tests in default test mode",
        })
        .option("fgrep", { alias: "f", type: "string", describe: "Only run tests matching this string" })
        .option("grep", { alias: "g", type: "string", describe: "Only run tests matching this regexp" })
        .option("invert", { alias: "i", type: "boolean", describe: "Inverts --grep and --fgrep matches" })
        .option("profile", { type: "boolean", describe: "Write profiling data to build/profiles (node only)" })
        .command("*", "run all supported test types")
        .command("esm", "run tests on node (ES6 modules)", () => testTypes.add(TestType.esm))
        .command("cjs", "run tests on node (CommonJS modules)", () => testTypes.add(TestType.cjs))
        .command("web", "run tests in web browser", () => testTypes.add(TestType.web))
        .command("manual", "start test server and print URL for manual testing", () => {
            testTypes.add(TestType.web);
            manual = true;
        })
        .strict().argv;

    const project = new Project(args.prefix);

    // If no test types are specified explicitly, run all enabled types
    if (!testTypes.size) {
        testTypes.add(TestType.esm);
        testTypes.add(TestType.cjs);
        if (args.web) {
            testTypes.add(TestType.web);
        }
    }

    let esmBuilt = false;
    async function buildEsm() {
        if (esmBuilt) {
            return;
        }

        await project.buildSource("esm");
        await project.buildTests("esm");

        esmBuilt = true;
    }

    const reporter = new ProgressReporter(project.pkg.start("Testing"));

    if (testTypes.has(TestType.esm)) {
        await buildEsm();
        await runTests(() => testNode("esm", loadFiles("esm"), reporter, args));
    }

    if (testTypes.has(TestType.cjs)) {
        await project.buildSource("cjs");
        await project.buildTests("cjs");
        await runTests(() => testNode("cjs", loadFiles("cjs"), reporter, args));
    }

    if (testTypes.has(TestType.web)) {
        await buildEsm();
        await runTests(() => testWeb(manual, loadFiles("esm"), reporter, args));
    }
}

async function runTests(runner: () => Promise<boolean>) {
    if (!(await runner())) {
        process.stdout.write(colors.bgRedBright.whiteBright(`Tests failed, aborting\n`));
        process.exit(1);
    }
}

function loadFiles(format: "esm" | "cjs") {
    const files = Array<string>();
    files.push(Package.tools.resolve(`dist/esm/testing/global-definitions.js`));
    files.push(...glob.sync(Package.project.resolve(`build/${format}/test/**/*Test.js`)));
    return files;
}
