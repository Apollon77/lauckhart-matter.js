/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClusterType } from "../../../cluster/ClusterType.js";
import { WindowCovering } from "../../../cluster/definitions/WindowCoveringCluster.js";
import { ImplementationError } from "../../../common/MatterError.js";
import { Logger } from "../../../log/Logger.js";
import { StatusCode, StatusResponseError } from "../../../protocol/interaction/StatusCode.js";
import { TypeFromPartialBitSchema } from "../../../schema/BitmapSchema.js";
import { isDeepEqual } from "../../../util/DeepEqual.js";
import { MaybePromise } from "../../../util/Promises.js";
import { WindowCoveringBehavior } from "./WindowCoveringBehavior.js";
import {
    GoToLiftPercentageRequest,
    GoToLiftValueRequest,
    GoToTiltPercentageRequest,
    GoToTiltValueRequest,
} from "./WindowCoveringInterface.js";

const logger = Logger.get("WindowCoveringServer");

const WindowCoveringServerBase = WindowCoveringBehavior.with(
    WindowCovering.Feature.Lift,
    WindowCovering.Feature.Tilt,
    WindowCovering.Feature.PositionAwareLift,
    WindowCovering.Feature.PositionAwareTilt,
    WindowCovering.Feature.AbsolutePosition,
);

/** What element should move? */
export enum MovementType {
    Lift,
    Tilt,
}

/** Status of the Calibration mode. */
export enum CalibrationMode {
    Enabled,
    Running,
    Disabled,
}

/**
 * Direction the Window covering should move.
 * The special state "DefinedByPosition" is used to indicate that the direction should be determined by the target
 * position and the implementation needs to determine it himself.
 */
export enum MovementDirection {
    Open,
    Close,
    DefinedByPosition,
}

type AbsoluteLimits = {
    open: number;
    closed: number;
};

const WC_PERCENT100THS_MIN_OPEN = 0;
const WC_PERCENT100THS_MAX_CLOSED = 10000;
const WC_PERCENT100THS_COEFFICIENT = 100;

/**
 * This is the default server implementation of {@link WindowCoveringBehavior}.
 *
 * This implementation includes all features of {@link WindowCovering.Cluster} and implements all mandatory commands.
 * When the cluster is used with position awareness, the default logic will automatically sync the current positions and
 * also the operational state as soon as the currentPosition*Percent100ths attributes are set. This means that the
 * develop also needs to set the currentPosition*Percent100ths and the rest is managed automatically. When the targetPosition*Percent100ths attribute is set, then the operational state is automatically updated based on the current and target values.
 * You should use {@link WindowCoveringServer.with} to specialize the class for the features your implementation supports.
 *
 * This implementation ignores by default all normal move-times and sets the target percentages immediately.
 *
 * The default implementation introduces the following additional attributes:
 * * supportsCalibration: set to true if the device supports calibration. Then also {@link WindowCoveringServerLogic.executeCalibration} must be implemented, default: false
 * * supportsMaintenanceMode: set to false if the device does not support a maintenance mode, default: true
 *
 * If you develop for a specific hardware you should extend the {@link WindowCoveringServer} class and implement the
 * following methods to natively use device features to correctly support the movement. For this the default
 * implementation uses special protected methods which are used by the real commands and are only responsible for the
 * actual value change logic. The benefit of this structure is that basic data validations and options checks are
 * already done and you can focus on the actual hardware interaction:
 * * {@link WindowCoveringServerLogic.handleMovement} Logic to actually move the device. Via Parameters the movement type (Lift/Tilt), direction, target percentage and information if motor is configured reversed are provided. When the device moves the current Positions (if supported by the device) are updated with the movement. The operational state is automatically updated by the default implementation based on current and target values of the cluster state.
 * * {@link WindowCoveringServerLogic.handleStopMovement} Logic to stop any movement of the device. You can use the super.handleStopMovement() to set the target positions to the current positions or do this yourself.
 * * {@link WindowCoveringServerLogic.executeCalibration} If supported, override this method to implement the calibration process. The default implementation returns an error as defined when Calibration is not supported. When not supported you should also add a Changing event handler to the mode attribute to make sure calibration mode is not set (needs to throw an ConstraintError).
 *
 * IMPORTANT NOTE:
 * This default implementation could have pitfalls when the calibration process and/or movement is handled via long
 * running promises. There could be edge cases not correctly handled by the current implementation when it comes to long
 * running movements or calibration processes - especially when these processes are long running async JS operations.
 * Also a movement coming in while another movement is still running is assumned to be handled by the device and not
 * expected on cluster side. If you have such cases please provide feedback and we can discuss how to improve the
 * default implementation.
 */
export class WindowCoveringServerLogic extends WindowCoveringServerBase {
    protected declare internal: WindowCoveringServerLogic.Internal;
    declare state: WindowCoveringServerLogic.State;

    override initialize() {
        this.#assertTypeAttribute(); // TODO: Remove once Validation supports feature specific enums

        // Initialize Internal state from the Mode attribute and keep in sync
        this.internal.inMaintenanceMode = !!this.state.mode.maintenanceMode;
        this.internal.calibrationMode =
            this.state.mode.calibrationMode && !this.state.mode.maintenanceMode
                ? CalibrationMode.Enabled
                : CalibrationMode.Disabled;
        this.reactTo(this.events.mode$Changing, this.#handleModeChanging);

        // Make sure that ConfigStatus is in sync with features (a bit of convenience)
        const configStatus = this.state.configStatus;
        if (this.features.lift) {
            if (this.features.positionAwareLift) {
                configStatus.liftPositionAware = true;
            }
        }
        if (this.features.tilt) {
            if (this.features.positionAwareTilt) {
                configStatus.tiltPositionAware = true;
            }
        }
        if (!isDeepEqual(configStatus, this.state.configStatus)) {
            this.state.configStatus = configStatus;
        }

        // Initially sync the target positions with the current positions, so we have no movement
        if (this.features.tilt) {
            this.state.targetPositionTiltPercent100ths = this.state.currentPositionTiltPercent100ths;
        }
        if (this.features.lift) {
            this.state.targetPositionLiftPercent100ths = this.state.currentPositionLiftPercent100ths;
        }

        // Keep position attributes (percentage and also absolute position) and operational state in sync
        this.reactTo(this.events.currentPositionLiftPercent100ths$Changing, this.#syncLiftCurrentPositions);
        this.reactTo(this.events.currentPositionTiltPercent100ths$Changing, this.#syncTiltCurrentPositions);

        // Update operational state when target position changes
        this.reactTo(this.events.targetPositionLiftPercent100ths$Changing, this.#handleLiftTargetPositionChanging);
        this.reactTo(this.events.targetPositionTiltPercent100ths$Changing, this.#handleTiltTargetPositionChanging);

        // Update the global operational status when lift or tilt status changes
        this.reactTo(this.events.operationalStatus$Changing, this.#handleOperationalStatusChanging);
    }

    /** Validates the Type attribute as long as the Validation does not support feature specific enums. */
    #assertTypeAttribute() {
        const allowedTypes = new Array<WindowCovering.WindowCoveringType>();
        if (this.features.lift) {
            if (this.features.tilt) {
                allowedTypes.push(WindowCovering.WindowCoveringType.TiltBlindLift);
            } else {
                allowedTypes.push(
                    WindowCovering.WindowCoveringType.Rollershade,
                    WindowCovering.WindowCoveringType.Rollershade2Motor,
                    WindowCovering.WindowCoveringType.RollershadeExterior,
                    WindowCovering.WindowCoveringType.RollershadeExterior2Motor,
                    WindowCovering.WindowCoveringType.Drapery,
                    WindowCovering.WindowCoveringType.Awning,
                    WindowCovering.WindowCoveringType.Shutter,
                    WindowCovering.WindowCoveringType.ProjectorScreen,
                );
            }
        }
        if (this.features.tilt && !this.features.lift) {
            allowedTypes.push(WindowCovering.WindowCoveringType.TiltBlindTiltOnly);
        }
        if (!allowedTypes.includes(this.state.type)) {
            throw new ImplementationError(
                `Unsupported type ${this.state.type} for features ${Logger.toJSON({
                    lift: this.features.lift,
                    tilt: this.features.tilt,
                })}`,
            );
        }
    }

    /**
     * Sync the mode attribute with the configStatus attribute and the internal state.
     */
    #handleModeChanging(mode: TypeFromPartialBitSchema<typeof WindowCovering.Mode>) {
        // According to chip implementation maintenance mode has priority over calibration mode
        if (mode.maintenanceMode && mode.calibrationMode) {
            mode.calibrationMode = false;
        }
        if (mode.maintenanceMode && !this.state.supportsMaintenanceMode) {
            throw new StatusResponseError("Maintenance mode not supported", StatusCode.ConstraintError);
        }
        this.internal.inMaintenanceMode = !!mode.maintenanceMode;

        if (mode.calibrationMode) {
            if (!this.state.supportsCalibration) {
                throw new StatusResponseError("Calibration not supported", StatusCode.ConstraintError);
            }
            if (this.internal.calibrationMode === CalibrationMode.Running) {
                // What to do here? For now lets leave unchanged
            } else {
                this.internal.calibrationMode = CalibrationMode.Enabled;
            }
        } else {
            this.internal.calibrationMode = CalibrationMode.Disabled;
        }

        const configStatus = this.state.configStatus;
        configStatus.operational = !mode.maintenanceMode || (mode.calibrationMode && !this.state.supportsCalibration);
        configStatus.liftMovementReversed = !!mode.motorDirectionReversed;
        if (isDeepEqual(configStatus, this.state.configStatus)) {
            this.asAdmin(() => {
                this.state.configStatus = configStatus;
            });
        }

        logger.debug(
            `Mode changed to ${Logger.toJSON(mode)} and config status to ${Logger.toJSON(configStatus)} and internal calibration mode to ${this.internal.calibrationMode}`,
        );
    }

    /** Update the global operational status based on the lift or tilt status. */
    #handleOperationalStatusChanging(
        operationalStatus: TypeFromPartialBitSchema<typeof WindowCovering.OperationalStatus>,
    ) {
        // Global Always follow Lift by priority or therefore fallback to Tilt
        const globalStatus =
            operationalStatus.lift !== WindowCovering.MovementStatus.Stopped
                ? operationalStatus.lift
                : operationalStatus.tilt;
        operationalStatus.global = globalStatus;
        logger.debug(
            `Operational status changed to ${Logger.toJSON(operationalStatus)} with new global status ${globalStatus}`,
        );
        this.state.operationalStatus = operationalStatus;
    }

    /** Update the operational state when the target lift position changes. */
    #handleLiftTargetPositionChanging(percent100ths: number | null) {
        if (this.features.positionAwareLift) {
            this.state.operationalStatus.lift = this.#computeOperationalState(
                percent100ths,
                this.state.currentPositionLiftPercent100ths,
            );
        }
    }

    /** Update the operational state when the target tilt position changes. */
    #handleTiltTargetPositionChanging(percent100ths: number | null) {
        if (this.features.positionAwareTilt) {
            this.state.operationalStatus.tilt = this.#computeOperationalState(
                percent100ths,
                this.state.currentPositionTiltPercent100ths,
            );
        }
    }

    /** Sync the current lift position attributes and the operational state. */
    #syncLiftCurrentPositions(percent100ths: number | null) {
        if (this.features.positionAwareLift) {
            this.state.currentPositionLiftPercentage =
                percent100ths === null ? percent100ths : Math.floor(percent100ths / WC_PERCENT100THS_COEFFICIENT);
            if (
                this.state.operationalStatus.lift !== WindowCovering.MovementStatus.Stopped &&
                percent100ths === this.state.targetPositionLiftPercent100ths
            ) {
                this.state.operationalStatus = {
                    ...this.state.operationalStatus,
                    lift: WindowCovering.MovementStatus.Stopped,
                };
                logger.debug("Lift movement stopped, target value reached");
            }
        }
        if (this.features.absolutePosition) {
            this.state.currentPositionLift = percent100ths === null ? null : this.#percent100thsToLift(percent100ths);
        }
        logger.debug(
            `Syncing lift position ${this.state.currentPositionLiftPercent100ths === null ? null : (this.state.currentPositionLiftPercent100ths / 100).toFixed(2)} to ${this.state.currentPositionLiftPercentage}% (${this.state.currentPositionLift})`,
        );
    }

    /** Sync the current tilt position attributes and the operational state. */
    #syncTiltCurrentPositions(percent100ths: number | null) {
        if (this.features.positionAwareTilt) {
            this.state.currentPositionTiltPercentage =
                percent100ths === null ? percent100ths : Math.floor(percent100ths / WC_PERCENT100THS_COEFFICIENT);
            if (
                this.state.operationalStatus.tilt !== WindowCovering.MovementStatus.Stopped &&
                percent100ths === this.state.targetPositionTiltPercent100ths
            ) {
                this.state.operationalStatus = {
                    ...this.state.operationalStatus,
                    tilt: WindowCovering.MovementStatus.Stopped,
                };
                logger.debug("Tilt movement stopped, target value reached");
            }
        }
        if (this.features.absolutePosition) {
            this.state.currentPositionTilt = percent100ths === null ? null : this.#percent100thsToTilt(percent100ths);
        }
        logger.debug(
            `Syncing tilt position ${this.state.currentPositionTiltPercent100ths === null ? null : (this.state.currentPositionTiltPercent100ths / 100).toFixed(2)} to ${this.state.currentPositionTiltPercentage}% (${this.state.currentPositionTilt})`,
        );
    }

    /** Compute the operational state based on the current and target position. */
    #computeOperationalState(target: number | null, current: number | null) {
        if (current === null || target === null) {
            return WindowCovering.MovementStatus.Stopped;
        } else if (current === target) {
            return WindowCovering.MovementStatus.Stopped;
        } else if (current < target) {
            return WindowCovering.MovementStatus.Closing;
        } else {
            return WindowCovering.MovementStatus.Opening;
        }
    }

    /**
     * Asserts if the device can be controlled or not because of an active Maintenance mode or a calibration is
     * required but not supported.
     */
    #assertMotionLockStatus() {
        if (this.internal.inMaintenanceMode) {
            throw new StatusResponseError("Device is in maintenance mode", StatusCode.Busy);
        }

        switch (this.internal.calibrationMode) {
            case CalibrationMode.Enabled:
                if (!this.state.supportsCalibration) {
                    // Should never happy normally because mode attribute should never be set
                    throw new StatusResponseError("Calibration not implemented", StatusCode.Failure);
                }
                break;
            case CalibrationMode.Running:
                // Calibration already in progress, not defined what to return here
                break;
            case CalibrationMode.Disabled:
                break;
        }

        if (!this.state.configStatus.operational) {
            throw new StatusResponseError("Device is not operational", StatusCode.Failure);
        }
    }

    /**
     * This is the default implementation for a device that do not support calibration, so an error is returned when the
     * calibration is requested. Override this method to implement an own calibration process if required.
     * @protected
     */
    protected executeCalibration(): MaybePromise {
        // We do nothing
    }

    /**
     * This is the default implementation to actually "move" the device. It logs the movement and updates the current
     * position based on the target position. Override this method to implement the actual movement of the device.
     *
     * @param type Which element should move, Lift or Tilt
     * @param reversed If the motor is configured reversed
     * @param direction The direction of the movement (Open, Close, DefinedByPosition)
     * @param targetPercent100ths Optionally the target position in percent 100ths. It depends on the used feature set of the cluster if this is provided or not.
     * @protected
     */
    protected async handleMovement(
        type: MovementType,
        reversed: boolean,
        direction: MovementDirection,
        targetPercent100ths?: number,
    ) {
        switch (type) {
            case MovementType.Lift:
                if (this.features.positionAwareLift) {
                    if (targetPercent100ths === undefined) {
                        throw new ImplementationError("Target position must be defined for position aware lift");
                    }
                    this.state.currentPositionLiftPercent100ths = targetPercent100ths;
                }
                break;
            case MovementType.Tilt:
                if (this.features.positionAwareTilt) {
                    if (targetPercent100ths === undefined) {
                        throw new ImplementationError("Target position must be defined for position aware lift");
                    }
                    this.state.currentPositionTiltPercent100ths = targetPercent100ths;
                }
                break;
        }
        const directionInfo =
            direction === MovementDirection.DefinedByPosition
                ? ` in direction by position`
                : ` in direction ${direction === MovementDirection.Close ? "Close" : "Open"}`;
        const targetInfo =
            targetPercent100ths === undefined ? "" : ` to target position ${(targetPercent100ths / 100).toFixed(2)}`;
        logger.debug(
            `Moving the device ${type === MovementType.Lift ? "Lift" : "Tilt"}${directionInfo} (reversed=${reversed})${targetInfo}`,
        );
    }

    /**
     * Internal method to handle a movement. If calibration is supported and needed then executeCalibration() is executed
     * before the actual movement. The method increases the numberOfActuations* attribute and updates the operational
     * status. The actual movement is triggered by the handleMovement method as a worker. This means, that the response
     * is sent in parallel to the actual movement.
     */
    #prepareMovement(type: MovementType, direction: MovementDirection, targetPercent100ths?: number): void {
        if (this.state.supportsCalibration && this.internal.calibrationMode === CalibrationMode.Enabled) {
            return this.endpoint.env.runtime.add(this.#executeCalibrationAndMove(type, direction, targetPercent100ths));
        }
        if (type === MovementType.Lift && this.state.configStatus.liftMovementReversed) {
            logger.debug("Lift movement is reversed");
        }

        switch (type) {
            case MovementType.Lift:
                this.state.numberOfActuationsLift = (this.state.numberOfActuationsLift ?? 0) + 1;
                if (
                    this.features.positionAwareLift &&
                    direction === MovementDirection.DefinedByPosition &&
                    targetPercent100ths !== undefined &&
                    this.state.currentPositionLiftPercent100ths !== null
                ) {
                    direction =
                        targetPercent100ths > this.state.currentPositionLiftPercent100ths
                            ? MovementDirection.Close
                            : MovementDirection.Open;
                }
                if (direction !== MovementDirection.DefinedByPosition) {
                    this.state.operationalStatus = {
                        ...this.state.operationalStatus,
                        lift:
                            direction === MovementDirection.Close
                                ? WindowCovering.MovementStatus.Closing
                                : WindowCovering.MovementStatus.Opening,
                    };
                }
                break;
            case MovementType.Tilt:
                this.state.numberOfActuationsTilt = (this.state.numberOfActuationsTilt ?? 0) + 1;
                if (
                    this.features.positionAwareLift &&
                    direction === MovementDirection.DefinedByPosition &&
                    targetPercent100ths !== undefined &&
                    this.state.currentPositionTiltPercent100ths !== null
                ) {
                    direction =
                        targetPercent100ths > this.state.currentPositionTiltPercent100ths
                            ? MovementDirection.Close
                            : MovementDirection.Open;
                }
                if (direction !== MovementDirection.DefinedByPosition) {
                    this.state.operationalStatus = {
                        ...this.state.operationalStatus,
                        tilt:
                            direction === MovementDirection.Close
                                ? WindowCovering.MovementStatus.Closing
                                : WindowCovering.MovementStatus.Opening,
                    };
                }
                break;
        }

        this.endpoint.env.runtime.add(
            this.handleMovement(
                type,
                type === MovementType.Lift && !!this.state.configStatus.liftMovementReversed,
                direction,
                targetPercent100ths,
            ),
        );
    }

    #executeCalibrationAndMove(type: MovementType, direction: MovementDirection, targetPercent100ths?: number) {
        let calibration;
        if (this.internal.calibrationMode === CalibrationMode.Enabled && this.state.supportsCalibration) {
            this.internal.calibrationMode = CalibrationMode.Running;
            calibration = this.executeCalibration();
        }
        return MaybePromise.then(calibration, () => {
            this.internal.calibrationMode = CalibrationMode.Disabled;
            return this.#prepareMovement(type, direction, targetPercent100ths);
        });
    }

    /**
     * This is the default implementation to stop any movement of the device. It sets the target positions to the current
     * positions and updates the operational state. Override this method to implement the actual stop movement logic.
     * If you make sure your implementation sets the current positions correctly, you can use "super.handleStopMovement()"
     * to re-use this default logic.
     * @protected
     */
    protected handleStopMovement(): MaybePromise {
        if (this.features.positionAwareLift) {
            this.state.targetPositionLiftPercent100ths = this.state.currentPositionLiftPercent100ths;
        }
        if (this.features.positionAwareTilt) {
            this.state.targetPositionTiltPercent100ths = this.state.currentPositionTiltPercent100ths;
        }
        if (!this.features.positionAwareLift && !this.features.positionAwareTilt) {
            this.state.operationalStatus = {
                global: WindowCovering.MovementStatus.Stopped,
                lift: WindowCovering.MovementStatus.Stopped,
                tilt: WindowCovering.MovementStatus.Stopped,
            };
        }
    }

    #triggerLiftMotion(direction: MovementDirection, targetPercent100ths?: number) {
        this.#prepareMovement(0 /* Lift */, direction, targetPercent100ths);
    }

    #triggerTiltMotion(direction: MovementDirection, targetPercent100ths?: number) {
        this.#prepareMovement(1 /* Tilt */, direction, targetPercent100ths);
    }

    /**
     * Move the WindowCovering up or open. For position aware devices the target position is set to 0%. The method calls
     * the handleMovement method to actually move the device.
     */
    override upOrOpen() {
        this.#assertMotionLockStatus();

        let targetLiftPercent100ths;
        let targetTiltPercent100ths;
        if (this.features.positionAwareLift) {
            this.state.targetPositionLiftPercent100ths = targetLiftPercent100ths = WC_PERCENT100THS_MIN_OPEN;
        }
        if (this.features.positionAwareTilt) {
            this.state.targetPositionTiltPercent100ths = targetTiltPercent100ths = WC_PERCENT100THS_MIN_OPEN;
        }

        if (this.features.lift) {
            this.#triggerLiftMotion(MovementDirection.Open, targetLiftPercent100ths);
        }
        if (this.features.tilt) {
            this.#triggerTiltMotion(MovementDirection.Open, targetTiltPercent100ths);
        }
    }

    /**
     * Move the WindowCovering down or close. For position aware devices the target position is set to 100%. The method
     * calls the handleMovement method to actually move the device.
     */
    override downOrClose() {
        this.#assertMotionLockStatus();

        let targetLiftPercent100ths;
        let targetTiltPercent100ths;
        if (this.features.positionAwareLift) {
            this.state.targetPositionLiftPercent100ths = targetLiftPercent100ths = WC_PERCENT100THS_MAX_CLOSED;
        }
        if (this.features.positionAwareTilt) {
            this.state.targetPositionTiltPercent100ths = targetTiltPercent100ths = WC_PERCENT100THS_MAX_CLOSED;
        }

        if (this.features.lift) {
            this.#triggerLiftMotion(MovementDirection.Close, targetLiftPercent100ths);
        }
        if (this.features.tilt) {
            this.#triggerTiltMotion(MovementDirection.Close, targetTiltPercent100ths);
        }
    }

    /**
     * Stop any movement of the WindowCovering. The method calls the handleStopMovement method to actually stop the
     * movement of the device.
     */
    override stopMotion() {
        this.#assertMotionLockStatus();

        return this.handleStopMovement();
    }

    /**
     * Move the WindowCovering to a specific lift value. The default implementation calculates the % value for the
     * target position. The method calls the handleMovement method to actually move the device to the defined position.
     */
    override goToLiftValue({ liftValue }: GoToLiftValueRequest) {
        this.#assertMotionLockStatus();

        this.state.targetPositionLiftPercent100ths = this.#liftToPercent100ths(liftValue);
        this.#triggerLiftMotion(MovementDirection.DefinedByPosition, this.state.targetPositionLiftPercent100ths);
    }

    /**
     * Move the WindowCovering to a specific tilt value. The method calls the handleMovement method to actually move the
     * device to the defined position.
     */
    override goToLiftPercentage({ liftPercent100thsValue }: GoToLiftPercentageRequest) {
        this.#assertMotionLockStatus();

        if (this.features.positionAwareLift) {
            this.state.targetPositionLiftPercent100ths = liftPercent100thsValue;
            this.#triggerLiftMotion(MovementDirection.DefinedByPosition, this.state.targetPositionLiftPercent100ths);
        } else {
            if (liftPercent100thsValue === 0) {
                this.upOrOpen();
            } else {
                this.downOrClose();
            }
        }
    }

    /**
     * Move the WindowCovering to a specific tilt value. The default implementation calculates the % value for the target
     * position. The method calls the handleMovement method to actually move the device to the defined position.
     */
    override goToTiltValue({ tiltValue }: GoToTiltValueRequest) {
        this.#assertMotionLockStatus();

        this.state.targetPositionTiltPercent100ths = this.#tiltToPercent100ths(tiltValue);
        this.#triggerTiltMotion(MovementDirection.DefinedByPosition, this.state.targetPositionTiltPercent100ths);
    }

    /**
     * Move the WindowCovering to a specific tilt value. The method calls the handleMovement method to actually move the
     * device to the defined position.
     */
    override goToTiltPercentage({ tiltPercent100thsValue }: GoToTiltPercentageRequest) {
        this.#assertMotionLockStatus();

        if (this.features.positionAwareTilt) {
            this.state.targetPositionTiltPercent100ths = tiltPercent100thsValue;
            this.#triggerTiltMotion(MovementDirection.DefinedByPosition, this.state.targetPositionTiltPercent100ths);
        } else {
            if (tiltPercent100thsValue === 0) {
                this.upOrOpen();
            } else {
                this.downOrClose();
            }
        }
    }

    /**
     * ConvertValue: Converts values from one range to another
     * * Range In  -> from  inputLowValue to   inputHighValue
     * * Range Out -> from outputLowValue to outputHighValue
     */
    #convertValue(
        inputLowValue: number,
        inputHighValue: number,
        outputLowValue: number,
        outputHighValue: number,
        value: number,
    ) {
        let inputMin = inputLowValue;
        let inputMax = inputHighValue;
        let outputMin = outputLowValue;
        let outputMax = outputHighValue;
        if (inputLowValue > inputHighValue) {
            inputMin = inputHighValue;
            inputMax = inputLowValue;
        }
        if (outputLowValue > outputHighValue) {
            outputMin = outputHighValue;
            outputMax = outputLowValue;
        }
        const inputRange = inputMax - inputMin;
        const outputRange = outputMax - outputMin;
        if (value < inputMin) {
            return outputMin;
        }
        if (value > inputMax) {
            return outputMax;
        }
        if (inputRange > 0) {
            return Math.round(outputMin + (outputRange * (value - inputMin)) / inputRange);
        }
        return outputMax;
    }

    #valueToPercent100ths(limits: AbsoluteLimits, absolute: number) {
        return this.#convertValue(
            limits.open,
            limits.closed,
            WC_PERCENT100THS_MIN_OPEN,
            WC_PERCENT100THS_MAX_CLOSED,
            absolute,
        );
    }

    #percent100thsToValue(limits: AbsoluteLimits, relative: number) {
        return this.#convertValue(
            WC_PERCENT100THS_MIN_OPEN,
            WC_PERCENT100THS_MAX_CLOSED,
            limits.open,
            limits.closed,
            relative,
        );
    }

    #liftToPercent100ths(lift: number) {
        return this.#valueToPercent100ths(
            { open: this.state.installedOpenLimitLift, closed: this.state.installedClosedLimitLift },
            lift,
        );
    }

    #percent100thsToLift(percent100ths: number) {
        return this.#percent100thsToValue(
            { open: this.state.installedOpenLimitLift, closed: this.state.installedClosedLimitLift },
            percent100ths,
        );
    }

    #tiltToPercent100ths(tilt: number) {
        return this.#valueToPercent100ths(
            { open: this.state.installedOpenLimitTilt, closed: this.state.installedClosedLimitTilt },
            tilt,
        );
    }

    #percent100thsToTilt(percent100ths: number) {
        return this.#percent100thsToValue(
            { open: this.state.installedOpenLimitTilt, closed: this.state.installedClosedLimitTilt },
            percent100ths,
        );
    }
}

export namespace WindowCoveringServerLogic {
    export class Internal {
        /** Status of the Device Calibration mode. */
        calibrationMode: CalibrationMode = CalibrationMode.Disabled;

        /** Status of the Device Maintenance mode. */
        inMaintenanceMode: boolean = false;
    }

    export class State extends WindowCoveringServerBase.State {
        /** Does the device supports calibration? */
        supportsCalibration: boolean = false;

        /** Does the device supports maintenance mode? */
        supportsMaintenanceMode: boolean = true;
    }

    export declare const ExtensionInterface: {
        handleMovement(
            type: MovementType,
            reversed: boolean,
            direction: MovementDirection,
            targetPercent100ths?: number,
        ): Promise<void>;
        handleStopMovement(): MaybePromise;
        executeCalibration(): MaybePromise;
    };
}

export class WindowCoveringServer extends WindowCoveringServerLogic.for(ClusterType(WindowCovering.Base)) {}
