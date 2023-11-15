/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { BindingBehavior } from "../../../behavior/definitions/BindingBehavior.js";
import { OnOffBehavior } from "../../../behavior/definitions/OnOffBehavior.js";
import { PumpConfigurationAndControlBehavior } from "../../../behavior/definitions/PumpConfigurationAndControlBehavior.js";
import { IdentifyBehavior } from "../../../behavior/definitions/IdentifyBehavior.js";
import { GroupsBehavior } from "../../../behavior/definitions/GroupsBehavior.js";
import { ScenesBehavior } from "../../../behavior/definitions/ScenesBehavior.js";
import { LevelControlBehavior } from "../../../behavior/definitions/LevelControlBehavior.js";
import { TemperatureMeasurementBehavior } from "../../../behavior/definitions/TemperatureMeasurementBehavior.js";
import { PressureMeasurementBehavior } from "../../../behavior/definitions/PressureMeasurementBehavior.js";
import { FlowMeasurementBehavior } from "../../../behavior/definitions/FlowMeasurementBehavior.js";
import { MutableEndpoint } from "../../type/MutableEndpoint.js";
import { SupportedBehaviors } from "../../part/SupportedBehaviors.js";
import { Identity } from "../../../util/Type.js";
import { MatterDeviceLibrarySpecificationV1_1 } from "../../../spec/Specifications.js";

export const PumpControllerRequirements = {
    /**
     * A definition for each client cluster supported by the endpoint per the Matter specification.
     */
    client: {
        mandatory: {
            Binding: BindingBehavior,
            OnOff: OnOffBehavior,
            PumpConfigurationAndControl: PumpConfigurationAndControlBehavior
        },

        optional: {
            Identify: IdentifyBehavior,
            Groups: GroupsBehavior,
            Scenes: ScenesBehavior,
            LevelControl: LevelControlBehavior,
            TemperatureMeasurement: TemperatureMeasurementBehavior,
            PressureMeasurement: PressureMeasurementBehavior,
            FlowMeasurement: FlowMeasurementBehavior
        }
    }
};

export const PumpControllerDeviceDefinition = MutableEndpoint({
    name: "PumpController",
    deviceType: 0x304,
    deviceRevision: 2,
    requirements: PumpControllerRequirements,
    behaviors: SupportedBehaviors()
});

/**
 * A Pump Controller device is capable of configuring and controlling a Pump device.
 *
 * @see {@link MatterDeviceLibrarySpecificationV1_1} § 6.5
 */
export interface PumpControllerDevice extends Identity<typeof PumpControllerDeviceDefinition> {}

export const PumpControllerDevice: PumpControllerDevice = PumpControllerDeviceDefinition;
