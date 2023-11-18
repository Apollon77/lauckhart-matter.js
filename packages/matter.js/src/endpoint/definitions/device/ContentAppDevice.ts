/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { KeypadInputServer } from "../../../behavior/definitions/keypad-input/Server.js";
import { ApplicationLauncherServer } from "../../../behavior/definitions/application-launcher/Server.js";
import { ApplicationBasicServer } from "../../../behavior/definitions/application-basic/Server.js";
import { ChannelServer } from "../../../behavior/definitions/channel/Server.js";
import { TargetNavigatorServer } from "../../../behavior/definitions/target-navigator/Server.js";
import { MediaPlaybackServer } from "../../../behavior/definitions/media-playback/Server.js";
import { ContentLauncherServer } from "../../../behavior/definitions/content-launcher/Server.js";
import { AccountLoginServer } from "../../../behavior/definitions/account-login/Server.js";
import { MutableEndpoint } from "../../type/MutableEndpoint.js";
import { SupportedBehaviors } from "../../part/SupportedBehaviors.js";
import { Identity } from "../../../util/Type.js";
import { MatterDeviceLibrarySpecificationV1_1 } from "../../../spec/Specifications.js";

export const ContentAppRequirements = {
    /**
     * An implementation for each server cluster supported by the endpoint per the Matter specification.
     */
    server: {
        mandatory: {
            KeypadInput: KeypadInputServer,
            ApplicationLauncher: ApplicationLauncherServer,
            ApplicationBasic: ApplicationBasicServer
        },

        optional: {
            Channel: ChannelServer,
            TargetNavigator: TargetNavigatorServer,
            MediaPlayback: MediaPlaybackServer,
            ContentLauncher: ContentLauncherServer,
            AccountLogin: AccountLoginServer
        }
    }
};

export const ContentAppDeviceDefinition = MutableEndpoint({
    name: "ContentApp",
    deviceType: 0x24,
    deviceRevision: 1,
    requirements: ContentAppRequirements,
    behaviors: SupportedBehaviors(
        ContentAppRequirements.server.mandatory.KeypadInput,
        ContentAppRequirements.server.mandatory.ApplicationLauncher,
        ContentAppRequirements.server.mandatory.ApplicationBasic
    )
});

/**
 * This defines conformance to the Content App device type.
 *
 * A Content App is usually an application built by a Content Provider. A Casting Video Player with a Content App
 * Platform is able to launch Content Apps and represent these apps as separate endpoints.
 *
 * @see {@link MatterDeviceLibrarySpecificationV1_1} § 10.5
 */
export interface ContentAppDevice extends Identity<typeof ContentAppDeviceDefinition> {}

export const ContentAppDevice: ContentAppDevice = ContentAppDeviceDefinition;
