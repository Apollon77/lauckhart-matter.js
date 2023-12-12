/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { TransactionFlowError } from "./Errors.js";
import type { Transaction } from "./Transaction.js";

/**
 * The lifecycle of a transaction adheres to the following discrete stages.
 */
export enum Status {
    /**
     * Transaction is registered but there are no ACID guarantees.
     */
    Shared = "shared",

    /**
     * Transaction is waiting to obtain exclusive access to resources.
     */
    Waiting = "waiting",

    /**
     * Transaction has exclusive access.  Reads will maintain consistency
     * and writes are allowed.
     */
    Exclusive = "exclusive",

    /**
     * Transaction is in the process of committing, phase one.
     */
    CommittingPhaseOne = "committing phase one",

    /**
     * Transaction is in the process of committing, phase two.
     */
    CommittingPhaseTwo = "committing phase two",

    /**
     * Transaction is in the process of rolling back.
     */
    RollingBack = "rolling back",
}

export namespace Status {
    export function assert(transaction: Transaction, acceptable: Status[], target: Status) {
        if (acceptable.indexOf(transaction.status) === -1) {
            throw new TransactionFlowError(
                `Cannot transition transaction from ${
                    formatStatus(transaction.status)
                } to ${
                    formatStatus(target)
                }`
            )
        }
    }

    export function formatStatus(status: Status) {
        return `<${status}>`;
    }
}
