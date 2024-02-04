/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Behavior } from "../../behavior/Behavior.js";
import { DescriptorServer } from "../../behavior/definitions/descriptor/DescriptorServer.js";
import { BehaviorBacking } from "../../behavior/internal/BehaviorBacking.js";
import { InternalError } from "../../common/MatterError.js";
import { Part } from "../../endpoint/Part.js";
import { PartServer } from "../../endpoint/PartServer.js";
import { PartInitializer } from "../../endpoint/part/PartInitializer.js";
import { Environment } from "../../environment/Environment.js";
import { Logger } from "../../log/Logger.js";
import { ServerStore } from "./storage/ServerStore.js";

const logger = Logger.get("BehaviorInit");

export class ServerPartInitializer extends PartInitializer {
    #store: ServerStore;

    constructor(environment: Environment) {
        super();
        this.#store = environment.get(ServerStore);
    }

    override initializeDescendent(part: Part) {
        if (!part.lifecycle.hasId) {
            part.id = this.#identifyPart(part);
        }

        this.#store.partStores.assignNumber(part);

        part.behaviors.require(DescriptorServer);
    }

    /**
     * If a {@link Part} does not yet have a {@link PartServer}, create one
     * now, then create a {@link BehaviorBacking} for a specific
     * {@link Behavior}.
     *
     * This is where we adapt parts and behaviors for a server role.
     */
    createBacking(part: Part, behavior: Behavior.Type): BehaviorBacking {
        return PartServer.forPart(part).createBacking(behavior);
    }

    /**
     * Select an ID for a part automatically based on available metadata.
     */
    #identifyPart(part: Part) {
        const basicInfo =
            part.behaviors.supported.basicInformation ?? part.behaviors.supported.bridgedDeviceBasicInformation;
        if (basicInfo) {
            const defaults = {
                ...new basicInfo.State(),
                ...part.behaviors.defaultsFor(basicInfo),
            };

            let id = (defaults as Record<string, string>).uniqueId;
            if (id) {
                return id;
            }

            id = (defaults as Record<string, string>).serialNumber;
            if (id) {
                return id;
            }
        }

        if (!(part.owner instanceof Part)) {
            throw new InternalError("Cannot determine ID for part with unknown parent type");
        }
        if (!part.owner.lifecycle.hasId) {
            throw new InternalError("Cannot determine ID for part because parent has no ID");
        }

        const index = part.owner.parts.indexOf(part);
        if (index === -1) {
            throw new InternalError("Cannot determine ID for part because parent does not list as child");
        }

        const id = `part${index}`;
        logger.warn(`Using fallback ID of ${id} for child of ${part.owner}; assign ID to remove this warning`);

        return id;
    }
}