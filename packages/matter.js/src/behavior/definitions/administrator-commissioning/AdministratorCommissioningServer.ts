/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { MatterDevice } from "../../../MatterDevice.js";
import { AccessLevel, Command, TlvNoResponse } from "../../../cluster/Cluster.js";
import { AdministratorCommissioning } from "../../../cluster/definitions/AdministratorCommissioningCluster.js";
import { InternalError } from "../../../common/MatterError.js";
import { Logger } from "../../../log/Logger.js";
import { StatusCode, StatusResponseError } from "../../../protocol/interaction/StatusCode.js";
import { PaseServer } from "../../../session/pase/PaseServer.js";
import { Time, Timer } from "../../../time/Time.js";
import { TlvUInt16, TlvUInt32 } from "../../../tlv/TlvNumber.js";
import { TlvField, TlvObject } from "../../../tlv/TlvObject.js";
import { TlvByteString } from "../../../tlv/TlvString.js";
import { AdministratorCommissioningBehavior } from "./AdministratorCommissioningBehavior.js";
import {
    MAXIMUM_COMMISSIONING_TIMEOUT_S,
    MINIMUM_COMMISSIONING_TIMEOUT_S,
    PAKE_PASSCODE_VERIFIER_LENGTH,
} from "./AdministratorCommissioningConstants.js";
import {
    OpenBasicCommissioningWindowRequest,
    OpenCommissioningWindowRequest,
} from "./AdministratorCommissioningInterface.js";

/**
 * Monkey patching Tlv Structure of openCommissioningWindow command to prevent data validation of the fields to be
 * handled as ConstraintError because we need to return a special error.
 * We do this to leave the model in fact for other validations and only apply the change for our Schema-aware Tlv parsing.
 */
AdministratorCommissioning.Cluster.commands = {
    ...AdministratorCommissioning.Cluster.commands,
    openCommissioningWindow: Command(
        0x0,
        TlvObject({
            commissioningTimeout: TlvField(0, TlvUInt16),
            pakePasscodeVerifier: TlvField(1, TlvByteString),
            discriminator: TlvField(2, TlvUInt16.bound({ max: 4095 })),
            iterations: TlvField(3, TlvUInt32),
            salt: TlvField(4, TlvByteString),
        }),
        0x0,
        TlvNoResponse,
        {
            invokeAcl: AccessLevel.Administer,
            timed: true,
        },
    ),
};

const logger = Logger.get("AdministratorCommissioningServer");

/**
 * This is the default server implementation of AdministratorCommissioningBehavior.
 *
 * This implementation includes all features of AdministratorCommissioning.Cluster. You should use
 * AdministratorCommissioningServer.with to specialize the class for the features your implementation supports.
 */
export class AdministratorCommissioningServer extends AdministratorCommissioningBehavior {
    declare internal: AdministratorCommissioningServer.Internal;
    declare state: AdministratorCommissioningServer.State;

    /**
     * This method opens an Enhanced Commissioning Window (A dynamic passcode is used which was provided by the caller).
     */
    override async openCommissioningWindow({
        pakePasscodeVerifier,
        discriminator,
        iterations,
        salt,
        commissioningTimeout,
    }: OpenCommissioningWindowRequest) {
        // We monkey patched the Tlv definition above, so take care about correct error handling
        if (pakePasscodeVerifier.length !== PAKE_PASSCODE_VERIFIER_LENGTH) {
            throw new StatusResponseError(
                "PAKE Passcode verifier length is invalid.",
                StatusCode.Failure,
                AdministratorCommissioning.StatusCode.PakeParameterError,
            );
        }
        if (iterations < 1000 || iterations > 100_000) {
            throw new StatusResponseError(
                "PAKE iterations invalid.",
                StatusCode.Failure,
                AdministratorCommissioning.StatusCode.PakeParameterError,
            );
        }
        if (salt.length < 16 || salt.length > 32) {
            throw new StatusResponseError(
                "PAKE salt has invalid length.",
                StatusCode.Failure,
                AdministratorCommissioning.StatusCode.PakeParameterError,
            );
        }

        const device = this.session?.getContext();

        this.#assertCommissioningWindowRequirements(commissioningTimeout, device);

        this.#initializeCommissioningWindow(
            commissioningTimeout,
            AdministratorCommissioning.CommissioningWindowStatus.EnhancedWindowOpen,
        );

        await device.allowEnhancedCommissioning(
            discriminator,
            PaseServer.fromVerificationValue(pakePasscodeVerifier, { iterations, salt }),
            this.callback(this.#endCommissioning),
        );
    }

    /** This method opens a Basic Commissioning Window. The default passcode is used. */
    // TODO - fix ClusterBehavior.for so this is hidden as it only applies when basic feature is enabled
    async openBasicCommissioningWindow({ commissioningTimeout }: OpenBasicCommissioningWindowRequest) {
        const device = this.session.getContext();

        this.#assertCommissioningWindowRequirements(commissioningTimeout, device);

        this.#initializeCommissioningWindow(
            commissioningTimeout,
            AdministratorCommissioning.CommissioningWindowStatus.BasicWindowOpen,
        );

        await device.allowBasicCommissioning(this.callback(this.#endCommissioning));
    }

    /** This method is used to revoke a commissioning window. */
    override async revokeCommissioning() {
        if (this.internal.commissioningWindowTimeout === undefined) {
            throw new StatusResponseError(
                "No commissioning window is opened that could be revoked.",
                StatusCode.Failure,
                AdministratorCommissioning.StatusCode.WindowNotOpen,
            );
        }

        logger.debug("Revoking commissioning window.");

        await this.#closeCommissioningWindow();

        const device = this.endpoint.env.get(MatterDevice);
        if (device.isFailsafeArmed()) {
            await device.failsafeContext.close();
        }
    }

    /**
     * Called whenever a Commissioning/Announcement Window is opened by this cluster. This method starts the timer and
     * adjusts the needed attributes.
     */
    #initializeCommissioningWindow(
        commissioningTimeout: number,
        windowStatus: AdministratorCommissioning.CommissioningWindowStatus,
    ) {
        if (this.internal.commissioningWindowTimeout !== undefined) {
            // Should never happen, but let's make sure
            throw new InternalError("Commissioning window already initialized.");
        }
        logger.debug(
            `Commissioning window timer started for ${commissioningTimeout} seconds for ${this.context.session?.name}.`,
        );
        this.internal.commissioningWindowTimeout = Time.getTimer(
            "Commissioning timeout",
            commissioningTimeout * 1000,
            this.callback(this.#commissioningTimeout),
        ).start();

        const adminFabric = this.session.getAssociatedFabric();

        this.state.windowStatus = windowStatus;
        this.state.adminFabricIndex = adminFabric.fabricIndex;
        this.state.adminVendorId = adminFabric.rootVendorId;

        const removeCallback = this.callback(this.#fabricRemovedCallback);

        this.internal.stopMonitoringFabricForRemoval = () => {
            adminFabric.deleteRemoveCallback(removeCallback);
        };

        this.session.getAssociatedFabric().addRemoveCallback(removeCallback);
    }

    /**
     * This method validates if a commissioning window can be opened and throws various exceptions in case of failures.
     */
    #assertCommissioningWindowRequirements(commissioningTimeout: number, device: MatterDevice) {
        if (this.internal.commissioningWindowTimeout !== undefined) {
            throw new StatusResponseError(
                "A commissioning window is already opened.",
                StatusCode.Failure,
                AdministratorCommissioning.StatusCode.Busy,
            );
        }

        if (commissioningTimeout > MAXIMUM_COMMISSIONING_TIMEOUT_S) {
            throw new StatusResponseError(
                `Commissioning timeout must not exceed ${MAXIMUM_COMMISSIONING_TIMEOUT_S} seconds.`,
                StatusCode.InvalidCommand,
            );
        }

        if (commissioningTimeout < MINIMUM_COMMISSIONING_TIMEOUT_S) {
            throw new StatusResponseError(
                `Commissioning timeout must not be lower then ${MINIMUM_COMMISSIONING_TIMEOUT_S} seconds.`,
                StatusCode.InvalidCommand,
            );
        }

        if (device.isFailsafeArmed()) {
            throw new StatusResponseError(
                "Failsafe timer armed, assume commissioning in progress.",
                StatusCode.Failure,
                AdministratorCommissioning.StatusCode.Busy,
            );
        }
    }

    /**
     * This method is used internally when the commissioning window timer expires or the commissioning was completed.
     */
    #endCommissioning() {
        logger.debug("End commissioning window.");
        if (this.internal.commissioningWindowTimeout !== undefined) {
            this.internal.commissioningWindowTimeout.stop();
            this.internal.commissioningWindowTimeout = undefined;
        }

        this.internal.stopMonitoringFabricForRemoval?.();
        this.state.adminFabricIndex = null;

        this.state.windowStatus = AdministratorCommissioning.CommissioningWindowStatus.WindowNotOpen;
        this.state.adminFabricIndex = null;
        this.state.adminVendorId = null;
    }

    /**
     * Closes the commissioning window per the matter specification.
     */
    async #closeCommissioningWindow() {
        this.callback(this.#endCommissioning);
        await this.endpoint.env.get(MatterDevice).endCommissioning();
    }

    /**
     * Close commissioning window on timeout when there's nobody to await the resulting promise
     * */
    #commissioningTimeout() {
        this.endpoint.env.runtime.addWorker(this.#closeCommissioningWindow());
    }

    /**
     * Invoked when fabric is removed.
     */
    #fabricRemovedCallback() {
        this.state.adminFabricIndex = null;
        this.internal.stopMonitoringFabricForRemoval?.();
    }

    /**
     * Clean up resources and stop the timer when the behavior is destroyed.
     */
    override [Symbol.asyncDispose]() {
        if (this.internal.commissioningWindowTimeout !== undefined) {
            this.internal.commissioningWindowTimeout.stop();
            this.internal.commissioningWindowTimeout = undefined;
        }
    }
}

export namespace AdministratorCommissioningServer {
    export class Internal {
        commissioningWindowTimeout?: Timer;
        stopMonitoringFabricForRemoval?: () => void;
    }

    export class State extends AdministratorCommissioningBehavior.State {
        // Spec doesn't declare a default here so set manually
        override windowStatus = AdministratorCommissioning.CommissioningWindowStatus.WindowNotOpen;
    }
}
