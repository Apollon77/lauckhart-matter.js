/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ImplementationError } from "../../../common/MatterError.js";
import { Logger } from "../../../log/Logger.js";
import { EventHandler } from "../../../protocol/interaction/EventHandler.js";
import { StorageContext } from "../../../storage/StorageContext.js";
import { StorageManager } from "../../../storage/StorageManager.js";
import { Environment } from "../../../common/Environment.js";
import { AsyncConstruction, asyncNew } from "../../../util/AsyncConstruction.js";
import type { NodeServer } from "../NodeServer.js";
import { PartStoreFactory } from "./PartStoreService.js";

export const logger = Logger.get("NodeStore");

/**
 * Non-volatile state management for a {@link NodeServer}.
 * 
 * The default implementation for matter.js uses synchronous APIs for storage.
 * However, this will change in the future, and other implementations may be
 * backed by asynchronous storage.  So the public API is asynchronous.
 */
export class ServerStore {
    #storageManager?: StorageManager;
    #eventHandler?: EventHandler;
    #sessionStorage?: StorageContext;
    #fabricStorage?: StorageContext;
    #eventStorage?: StorageContext;
    #rootStore?: PartStoreFactory;
    #construction: AsyncConstruction<ServerStore>;

    get construction() {
        return this.#construction;
    }

    /**
     * Create a new store.
     * 
     * TODO - implement conversion from 0.7 format so people can change API
     * seamlessly
     */
    constructor(environment: Environment, nodeId: string, nextEndpointNumber: number) {
        let nextNumber = nextEndpointNumber;

        this.#construction = AsyncConstruction(
            this,
            async () => {
                this.#storageManager = await environment.createStorage(nodeId);
        
                this.#rootStore = await asyncNew(
                    PartStoreFactory,
                    {
                        storage: this.#storageManager.createContext("root"),
                        nextNumber,
                    }
                );
            }
        )
    }

    static async create(environment: Environment, nodeId: string, nextEndpointNumber: number) {
        return await asyncNew(this, environment, nodeId, nextEndpointNumber);
    }

    async [Symbol.asyncDispose]() {
        await this.#construction;
        this.#storageManager?.close();
    }

    get eventStorage() {
        if (!this.#eventStorage) {
            this.#eventStorage = this.#storage.createContext("events");
        }
        return this.#eventStorage;
    }

    get eventHandler() {
        if (!this.#eventHandler) {
            this.#eventHandler = new EventHandler(this.eventStorage);
        }
        return this.#eventHandler;
    }

    get sessionStorage() {
        if (!this.#sessionStorage) {
            this.#sessionStorage = this.#storage.createContext("sessions");
        }
        return this.#sessionStorage;
    }

    get fabricStorage() {
        if (!this.#fabricStorage) {
            this.#fabricStorage = this.#storage.createContext("fabrics");
        }
        return this.#fabricStorage;
    }

    get partStores() {
        if (this.#rootStore === undefined) {
            throw new ImplementationError("Part storage accessed prior to initialization");
        }
        return this.#rootStore;
    }

    get #storage() {
        if (this.#storageManager === undefined) {
            throw new ImplementationError("Node storage accessed prior to initialization");
        }
        return this.#storageManager;
    }
}