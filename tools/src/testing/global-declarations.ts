/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import type Chai from "chai";
import "chai-as-promised";

declare global {
    // Our globals
    const expect: typeof Chai.expect;
    const disableLogBuffering: () => void;
    const captureLog: (fn: () => void) => { level: number, message: string };
    const captureLogs: (fn: () => void) => { level: number, message: string }[];
}
