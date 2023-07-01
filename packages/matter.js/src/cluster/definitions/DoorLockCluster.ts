/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { BitFlag, BitFlags } from "../../schema/BitmapSchema.js";
import { Attribute, AccessLevel, OptionalWritableAttribute, WritableAttribute, FixedAttribute, OptionalAttribute, Command, TlvNoResponse, OptionalCommand, Event, EventPriority } from "../../cluster/Cluster.js";
import { TlvEnum, TlvUInt8, TlvUInt32, TlvUInt16, TlvBitmap, TlvUInt64 } from "../../tlv/TlvNumber.js";
import { TlvNullable } from "../../tlv/TlvNullable.js";
import { TlvBoolean } from "../../tlv/TlvBoolean.js";
import { TlvString, TlvByteString } from "../../tlv/TlvString.js";
import { TlvObject, TlvOptionalField, TlvField } from "../../tlv/TlvObject.js";
import { TlvArray } from "../../tlv/TlvArray.js";
import { TlvNoArguments } from "../../tlv/TlvNoArguments.js";
import { BuildCluster } from "../../cluster/ClusterBuilder.js";

/**
 * This attribute has the following possible values:
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.1
 */
export const enum LockState {
    /**
     * Lock state is not fully locked
     */
    NotFullyLocked = 0,

    /**
     * Lock state is fully locked
     */
    Locked = 1,

    /**
     * Lock state is fully unlocked
     */
    Unlocked = 2
};

/**
 * The LockType attribute is indicated by an enumeration:
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.2
 */
export const enum LockType {
    /**
     * Physical lock type is dead bolt
     */
    Deadbolt = 0,

    /**
     * Physical lock type is magnetic
     */
    Magnetic = 1,

    /**
     * Physical lock type is other
     */
    Other = 2,

    /**
     * Physical lock type is mortise
     */
    Mortise = 3,

    /**
     * Physical lock type is rim
     */
    Rim = 4,

    /**
     * Physical lock type is latch bolt
     */
    LatchBolt = 5,

    /**
     * Physical lock type is cylindrical lock
     */
    CylindricalLock = 6,

    /**
     * Physical lock type is tubular lock
     */
    TubularLock = 7,

    /**
     * Physical lock type is interconnected lock
     */
    InterconnectedLock = 8,

    /**
     * Physical lock type is dead latch
     */
    DeadLatch = 9,

    /**
     * Physical lock type is door furniture
     */
    DoorFurniture = 10
};

/**
 * This bitmap contains all operating bits of the Operating Mode Attribute
 * supported by the lock. All operating modes NOT supported by a lock SHALL be
 * set to one. The value of the OperatingMode enumeration defines the related
 * bit to be set, as shown below:
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.24
 */
export const SupportedOperatingModesBits = {
    Vacation: BitFlag(1),
    Privacy: BitFlag(2),
    NoRemoteLockUnlock: BitFlag(8),
    Passage: BitFlag(16)
};

export const SupportedOperatingModes = TlvBitmap(TlvUInt16, SupportedOperatingModesBits);

/**
 * This attribute represents the default configurations as they are physically
 * set on the device (example: hardware dip switch setting, etc…) and
 * represents the default setting for some of the attributes within this
 * cluster (for example: LED, Auto Lock, Sound Volume, and Operating Mode
 * attributes).
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.28
 */
export const DefaultConfigurationRegisterBits = {
    EnableLocalProgrammingEnabled: BitFlag(1),
    KeypadInterfaceDefaultAccessEnabled: BitFlag(2),
    RemoteInterfaceDefaultAccessIsEnabled: BitFlag(4),
    SoundEnabled: BitFlag(32),
    AutoRelockTimeSet: BitFlag(64),
    LedSettingsSet: BitFlag(128)
};

export const DefaultConfigurationRegister = TlvBitmap(TlvUInt16, DefaultConfigurationRegisterBits);

/**
 * The local programming features that will be disabled when
 * EnableLocalProgramming attribute is set to False. If a door lock doesn’t
 * support disabling one aspect of local programming it SHALL return
 * CONSTRAINT_ERROR during a write operation of this attribute. If the
 * EnableLocalProgramming attribute is set to True then all local programming
 * features SHALL be enabled regardless of the bits set to 0 in this attribute.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.33
 */
export const LocalProgrammingFeaturesBits = {
    AddUsersCredentialsSchedulesLocally: BitFlag(1),
    ModifyUsersCredentialsSchedulesLocally: BitFlag(2),
    ClearUsersCredentialsSchedulesLocally: BitFlag(4),
    AdjustLockSettingsLocally: BitFlag(8)
};

export const LocalProgrammingFeatures = TlvBitmap(TlvUInt8, LocalProgrammingFeaturesBits);

/**
 * This attribute is only supported if the Alarms cluster is on the same
 * endpoint. The alarm mask is used to turn on/off alarms for particular
 * functions. Alarms for an alarm group are enabled if the associated alarm
 * mask bit is set. Each bit represents a group of alarms. Entire alarm groups
 * can be turned on or off by setting or clearing the associated bit in the
 * alarm mask.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.39
 */
export const AlarmMaskBits = {
    LockingMechanismJammed: BitFlag(0),
    LockResetToFactoryDefaults: BitFlag(1),
    Reserved: BitFlag(2),
    RfModulePowerCycled: BitFlag(3),
    TamperAlarmWrongCodeEntryLimit: BitFlag(4),
    TamperAlarmFrontEscutcheonRemovedFromMain: BitFlag(5),
    ForcedDoorOpenUnderDoorLockedCondition: BitFlag(6)
};

export const AlarmMask = TlvBitmap(TlvUInt16, AlarmMaskBits);

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const LockDoorRequest = TlvObject({ PinCode: TlvOptionalField(0, TlvByteString) });

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const UnlockDoorRequest = TlvObject({ PinCode: TlvOptionalField(0, TlvByteString) });

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const UnlockWithTimeoutRequest = TlvObject({
    Timeout: TlvField(0, TlvUInt16),
    PinCode: TlvOptionalField(1, TlvByteString)
});

/**
 * The Alarm Code enum shall indicate the alarm type.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.1
 */
export const enum AlarmCodeEnum {
    /**
     * Locking Mechanism Jammed
     */
    LockJammed = 0,

    /**
     * Lock Reset to Factory Defaults
     */
    LockFactoryReset = 1,

    /**
     * Lock Radio Power Cycled
     */
    LockRadioPowerCycled = 3,

    /**
     * Tamper Alarm - wrong code entry limit
     */
    WrongCodeEntryLimit = 4,

    /**
     * Tamper Alarm - front escutcheon removed from main
     */
    FrontEsceutcheonRemoved = 5,

    /**
     * Forced Door Open under Door Locked Condition
     */
    DoorForcedOpen = 6,

    /**
     * Door ajar
     */
    DoorAjar = 7,

    /**
     * Force User SOS alarm
     */
    ForcedUser = 8
};

/**
 * The door lock cluster provides several alarms which can be sent when there
 * is a critical state on the door lock. The alarms available for the door lock
 * cluster are listed in the AlarmCodeEnum section below.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.1
 */
export const DoorLockAlarmEvent = TlvObject({
    /**
     * The alarm code of the event that has happened.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.1.1
     */
    AlarmCode: TlvField(0, TlvEnum<AlarmCodeEnum>())
});

/**
 * The LockOperationType enumeration shall indicate the type of Lock operation
 * performed.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.10
 */
export const enum LockOperationTypeEnum {
    Lock = 0,
    Unlock = 1,
    NonAccessUserEvent = 2,
    ForcedUserEvent = 3
};

/**
 * The OperationSource enumeration shall indicate the source of the Lock/Unlock
 * operation performed.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.13
 */
export const enum OperationSourceEnum {
    Unspecified = 0,
    Manual = 1,
    ProprietaryRemote = 2,
    Keypad = 3,
    Auto = 4,
    Button = 5,
    Schedule = 6,
    Remote = 7,
    Rfid = 8,
    Biometric = 9
};

/**
 * The Credential Type enum shall indicate the credential type.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.4
 */
export const enum CredentialTypeEnum {
    ProgrammingPin = 0,
    Pin = 1,
    Rfid = 2,
    Fingerprint = 3,
    FingerVein = 4,
    Face = 5
};

/**
 * The CredentialStruct is used in LockOperation event and Get User Record
 * Response command and shall indicate the credential types and their
 * corresponding indices (if any) for the event or user record.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.3
 */
export const CredentialStruct = TlvObject({
    /**
     * The credential type used to authorize the lock operation.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.3.1
     */
    CredentialType: TlvField(0, TlvEnum<CredentialTypeEnum>()),

    /**
     * This is the index of the specific credential used to authorize the lock
     * operation in the list of credentials identified by CredentialType (e.g.
     * schedule, PIN, RFID, etc.). This SHALL be set to 0 if CredentialType is
     * ProgrammingPIN or does not correspond to a list that can be indexed into.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.3.2
     */
    CredentialIndex: TlvField(1, TlvUInt16)
});

/**
 * The door lock server sends out a LockOperation event when the event is
 * triggered by the various lock operation sources.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.3
 */
export const LockOperationEvent = TlvObject({
    /**
     * The type of the lock operation that was performed.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.3.1
     */
    LockOperationType: TlvField(0, TlvEnum<LockOperationTypeEnum>()),

    /**
     * The source of the lock operation that was performed.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.3.2
     */
    OperationSource: TlvField(1, TlvEnum<OperationSourceEnum>()),

    /**
     * The lock UserIndex who performed the lock operation. This SHALL be null
     * if there is no user index that can be determined for the given operation
     * source. This SHALL NOT be null if a user index can be determined. In
     * particular, this SHALL NOT be null if the operation was associated with
     * a valid credential.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.3.3
     */
    UserIndex: TlvField(2, TlvNullable(TlvUInt16)),

    /**
     * The fabric index of the fabric that performed the lock operation. This
     * SHALL be null if there is no fabric that can be determined for the given
     * operation source. This SHALL NOT be null if the operation source is
     * "Remote".
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.3.4
     */
    FabricIndex: TlvField(3, TlvNullable(TlvUInt8)),

    /**
     * The Node ID of the node that performed the lock operation. This SHALL be
     * null if there is no Node associated with the given operation source.
     * This SHALL NOT be null if the operation source is "Remote".
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.3.5
     */
    SourceNode: TlvField(4, TlvNullable(TlvUInt64)),

    /**
     * The list of credentials used in performing the lock operation. This
     * SHALL be null if no credentials were involved.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.3.6
     */
    Credentials: TlvOptionalField(5, TlvNullable(TlvArray(CredentialStruct)))
});

/**
 * The OperationError enumeration shall indicate the error cause of the
 * Lock/Unlock operation performed.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.11
 */
export const enum OperationErrorEnum {
    Unspecified = 0,
    InvalidCredential = 1,
    DisabledUserDenied = 2,
    Restricted = 3,
    InsufficientBattery = 4
};

/**
 * The door lock server sends out a LockOperationError event when a lock
 * operation fails for various reasons.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.4
 */
export const LockOperationErrorEvent = TlvObject({
    /**
     * The type of the lock operation that was performed.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.4.1
     */
    LockOperationType: TlvField(0, TlvEnum<LockOperationTypeEnum>()),

    /**
     * The source of the lock operation that was performed.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.4.2
     */
    OperationSource: TlvField(1, TlvEnum<OperationSourceEnum>()),

    /**
     * The lock operation error triggered when the operation was performed.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.4.3
     */
    OperationError: TlvField(2, TlvEnum<OperationErrorEnum>()),

    /**
     * The lock UserIndex who performed the lock operation. This SHALL be null
     * if there is no user id that can be determined for the given operation
     * source.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.4.4
     */
    UserIndex: TlvField(3, TlvNullable(TlvUInt16)),

    /**
     * The fabric index of the fabric that performed the lock operation. This
     * SHALL be null if there is no fabric that can be determined for the given
     * operation source. This SHALL NOT be null if the operation source is
     * "Remote".
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.4.5
     */
    FabricIndex: TlvField(4, TlvNullable(TlvUInt8)),

    /**
     * The Node ID of the node that performed the lock operation. This SHALL be
     * null if there is no Node associated with the given operation source.
     * This SHALL NOT be null if the operation source is
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.4.6
     */
    SourceNode: TlvField(5, TlvNullable(TlvUInt64)),

    /**
     * The list of credentials used in performing the lock operation. This
     * SHALL be null if no credentials were involved.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.4.7
     */
    Credentials: TlvOptionalField(6, TlvNullable(TlvArray(CredentialStruct)))
});

/**
 * The DoorState enumeration shall indicate the current door state. The data
 * type of the DoorState
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.7
 */
export const enum DoorStateEnum {
    /**
     * Door state is open
     */
    DoorOpen = 0,

    /**
     * Door state is closed
     */
    DoorClosed = 1,

    /**
     * Door state is jammed
     */
    DoorJammed = 2,

    /**
     * Door state is currently forced open
     */
    DoorForcedOpen = 3,

    /**
     * Door state is invalid for unspecified reason
     */
    DoorUnspecifiedError = 4,

    /**
     * Door state is ajar
     */
    DoorAjar = 5
};

/**
 * The door lock server sends out a DoorStateChange event when the door lock
 * door state changes. The data of this event SHALL contain the following
 * information:
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.2
 */
export const DoorStateChangeEvent = TlvObject({
    /**
     * The new door state for this door event.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.2.1
     */
    DoorState: TlvField(0, TlvEnum<DoorStateEnum>())
});

/**
 * This bitmap contains a bit for every value of CredentialRuleEnum supported
 * on this device.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.19
 */
export const CredentialRulesSupportBits = {
    Single: BitFlag(0),
    Dual: BitFlag(1),
    Tri: BitFlag(4)
};

export const CredentialRulesSupport = TlvBitmap(TlvUInt8, CredentialRulesSupportBits);

/**
 * The DataOperationType enum shall indicate the data operation performed.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.5
 */
export const enum DataOperationTypeEnum {
    /**
     * Data is being added or was added
     */
    Add = 0,

    /**
     * Data is being cleared or was cleared
     */
    Clear = 1,

    /**
     * Data is being modified or was modified
     */
    Modify = 2
};

/**
 * The UserStatus enum used in various commands shall indicate what the status
 * is for a specific user ID.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.15
 */
export const enum UserStatusEnum {
    Available = 0,
    OccupiedEnabled = 1,
    OccupiedDisabled = 3
};

/**
 * The UserType enum used in various commands shall indicate what the type is
 * for a specific user ID.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.16
 */
export const enum UserTypeEnum {
    /**
     * User has access 24/7 provided proper PIN or RFID is supplied (e.g.,
     * owner).
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.16.1
     */
    UnrestrictedUser = 0,

    /**
     * User has ability to open lock within a specific time period (e.g.,
     * guest).
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.16.2
     */
    YearDayScheduleUser = 1,

    /**
     * User has ability to open lock based on specific time period within a
     * reoccurring weekly schedule (e.g., cleaning worker).
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.16.3
     */
    WeekDayScheduleUser = 2,

    /**
     * User has ability to both program and operate the door lock. This user
     * can manage the users and user schedules. In all other respects this user
     * matches the unrestricted (default) user. ProgrammingUser is the only
     * user that can disable the user interface (keypad, remote, etc…).
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.16.4
     */
    ProgrammingUser = 3,

    /**
     * User is recognized by the lock but does not have the ability to open the
     * lock. This user will only cause the lock to generate the appropriate
     * event notification to any bound devices.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.16.5
     */
    NonAccessUser = 4,

    /**
     * User has ability to open lock but a ForcedUser LockOperationType and
     * ForcedUser silent alarm will be emitted to allow a notified Node to
     * alert emergency services or contacts on the user account when used.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.16.6
     */
    ForcedUser = 5,

    /**
     * User has ability to open lock once after which the lock SHALL change the
     * corresponding user record UserStatus value to OccupiedDisabled
     * automatically.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.16.7
     */
    DisposableUser = 6,

    /**
     * User has ability to open lock for ExpiringUserTimeout attribute minutes
     * after the first use of the PIN code, RFID code, Fingerprint, or other
     * credential. After ExpiringUserTimeout minutes the corresponding user
     * record UserStatus value SHALL be set to OccupiedDisabled automatically
     * by the lock. The lock SHALL persist the timeout across reboots such that
     * the ExpiringUserTimeout is honored.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.16.8
     */
    ExpiringUser = 7,

    /**
     * User access is restricted by Week Day and/or Year Day schedule.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.16.9
     */
    ScheduleRestrictedUser = 8,

    /**
     * User access and PIN code is restricted to remote lock/unlock commands
     * only. This type of user might be useful for regular delivery services or
     * voice assistant unlocking operations to prevent a PIN code credential
     * created for them from being used at the keypad. The PIN code credential
     * would only be provided over-the-air for the lock/unlock commands.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.16.10
     */
    RemoteOnlyUser = 9
};

/**
 * The CredentialRule enum used in various commands shall indicate the
 * credential rule that can be applied to a particular user.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.2
 */
export const enum CredentialRuleEnum {
    Single = 0,
    Dual = 1,
    Tri = 2
};

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const SetUserRequest = TlvObject({
    OperationType: TlvField(0, TlvEnum<DataOperationTypeEnum>()),
    UserIndex: TlvField(1, TlvUInt16),
    UserName: TlvField(2, TlvNullable(TlvString)),
    UserUniqueId: TlvField(3, TlvNullable(TlvUInt32)),
    UserStatus: TlvField(4, TlvNullable(TlvEnum<UserStatusEnum>())),
    UserType: TlvField(5, TlvNullable(TlvEnum<UserTypeEnum>())),
    CredentialRule: TlvField(6, TlvNullable(TlvEnum<CredentialRuleEnum>()))
});

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const GetUserResponseRequest = TlvObject({
    UserIndex: TlvField(0, TlvUInt16),
    UserName: TlvField(1, TlvNullable(TlvString)),
    UserUniqueId: TlvField(2, TlvNullable(TlvUInt32)),
    UserStatus: TlvField(3, TlvNullable(TlvEnum<UserStatusEnum>())),
    UserType: TlvField(4, TlvNullable(TlvEnum<UserTypeEnum>())),
    CredentialRule: TlvField(5, TlvNullable(TlvEnum<CredentialRuleEnum>())),
    Credentials: TlvField(6, TlvNullable(CredentialStruct)),
    CreatorFabricIndex: TlvField(7, TlvNullable(TlvUInt8)),
    LastModifiedFabricIndex: TlvField(8, TlvNullable(TlvUInt8)),
    NextUserIndex: TlvField(9, TlvNullable(TlvUInt16))
});

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const GetUserRequest = TlvObject({ UserIndex: TlvField(0, TlvUInt16) });

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const ClearUserRequest = TlvObject({ UserIndex: TlvField(0, TlvUInt16) });

export const enum DlStatus {
    Success = 0,
    Failure = 1,
    Duplicate = 2,
    Occupied = 3,
    InvalidField = 133,
    ResourceExhausted = 137,
    NotFound = 139
};

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const SetCredentialResponseRequest = TlvObject({
    Status: TlvField(0, TlvEnum<DlStatus>()),
    UserIndex: TlvField(1, TlvNullable(TlvUInt16)),
    NextCredentialIndex: TlvField(2, TlvNullable(TlvUInt16))
});

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const SetCredentialRequest = TlvObject({
    OperationType: TlvField(0, TlvEnum<DataOperationTypeEnum>()),
    Credential: TlvField(1, CredentialStruct),
    CredentialData: TlvField(2, TlvByteString),
    UserIndex: TlvField(3, TlvNullable(TlvUInt16)),
    UserStatus: TlvField(4, TlvNullable(TlvEnum<UserStatusEnum>())),
    UserType: TlvField(5, TlvNullable(TlvEnum<UserTypeEnum>()))
});

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const GetCredentialStatusResponseRequest = TlvObject({
    CredentialExists: TlvField(0, TlvBoolean),
    UserIndex: TlvField(1, TlvNullable(TlvUInt16)),
    CreatorFabricIndex: TlvField(2, TlvNullable(TlvUInt8)),
    LastModifiedFabricIndex: TlvField(3, TlvNullable(TlvUInt8)),
    NextCredentialIndex: TlvField(4, TlvNullable(TlvUInt16))
});

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const GetCredentialStatusRequest = TlvObject({ Credential: TlvField(0, CredentialStruct) });

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const ClearCredentialRequest = TlvObject({ Credential: TlvField(0, TlvNullable(CredentialStruct)) });

/**
 * The LockDataType enum shall indicate the data type that is being or has
 * changed.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.9
 */
export const enum LockDataTypeEnum {
    /**
     * Unspecified or manufacturer specific lock user data added, cleared, or
     * modified.
     */
    Unspecified = 0,

    /**
     * Lock programming PIN code was added, cleared, or modified.
     */
    ProgrammingCode = 1,

    /**
     * Lock user index was added, cleared, or modified.
     */
    UserIndex = 2,

    /**
     * Lock user week day schedule was added, cleared, or modified.
     */
    WeekDaySchedule = 3,

    /**
     * Lock user year day schedule was added, cleared, or modified.
     */
    YearDaySchedule = 4,

    /**
     * Lock holiday schedule was added, cleared, or modified.
     */
    HolidaySchedule = 5,

    /**
     * Lock user PIN code was added, cleared, or modified.
     */
    Pin = 6,

    /**
     * Lock user RFID code was added, cleared, or modified.
     */
    Rfid = 7,

    /**
     * Lock user fingerprint was added, cleared, or modified.
     */
    Fingerprint = 8,

    /**
     * Lock user finger-vein information was added, cleared, or modified.
     */
    FingerVein = 9,

    /**
     * Lock user face information was added, cleared, or modified.
     */
    Face = 10
};

/**
 * The door lock server sends out a LockUserChange event when a lock user,
 * schedule, or credential change has occurred.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.5
 */
export const LockUserChangeEvent = TlvObject({
    /**
     * The lock data type that was changed.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.5.1
     */
    LockDataType: TlvField(0, TlvEnum<LockDataTypeEnum>()),

    /**
     * The data operation performed on the lock data type changed.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.5.2
     */
    DataOperationType: TlvField(1, TlvEnum<DataOperationTypeEnum>()),

    /**
     * The source of the user data change.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.5.3
     */
    OperationSource: TlvField(2, TlvEnum<OperationSourceEnum>()),

    /**
     * The lock UserIndex associated with the change (if any). This SHALL be
     * null if there is no specific user associated with the data operation.
     * This SHALL be 0xFFFE if all users are affected (e.g. Clear Users).
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.5.4
     */
    UserIndex: TlvField(3, TlvNullable(TlvUInt16)),

    /**
     * The fabric index of the fabric that performed the change (if any). This
     * SHALL be null if there is no fabric that can be determined to have
     * caused the change. This SHALL NOT be null if the operation source is
     * "Remote".
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.5.5
     */
    FabricIndex: TlvField(4, TlvNullable(TlvUInt8)),

    /**
     * The Node ID that that performed the change (if any). The Node ID of the
     * node that performed the change. This SHALL be null if there was no Node
     * involved in the change. This SHALL NOT be null if the operation source
     * is "Remote".
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.5.6
     */
    SourceNode: TlvField(5, TlvNullable(TlvUInt64)),

    /**
     * This is the index of the specific item that was changed (e.g. schedule,
     * PIN, RFID, etc.) in the list of items identified by LockDataType. This
     * SHALL be null if the LockDataType does not correspond to a list that can
     * be indexed into (e.g. ProgrammingUser). This SHALL be 0xFFFE if all
     * indices are affected (e.g. Clear PIN Code, Clear RFID Code, Clear Week
     * Day Schedule, Clear Year Day Schedule, etc.).
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.5.7
     */
    DataIndex: TlvField(6, TlvNullable(TlvUInt16))
});

/**
 * The DaysMask field used in various commands and shall indicate the days of
 * the week the Week Day schedule applies for.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.6
 */
export const DaysMaskMapBits = {
    Sunday: BitFlag(0),
    Tuesday: BitFlag(2),
    Wednesday: BitFlag(8),
    Thursday: BitFlag(16),
    Friday: BitFlag(32),
    Saturday: BitFlag(64)
};

export const DaysMaskMap = TlvBitmap(TlvUInt8, DaysMaskMapBits);

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const SetWeekDayScheduleRequest = TlvObject({
    WeekDayIndex: TlvField(0, TlvUInt8),
    UserIndex: TlvField(1, TlvUInt16),
    DaysMask: TlvField(2, DaysMaskMap),
    StartHour: TlvField(3, TlvUInt8),
    StartMinute: TlvField(4, TlvUInt8),
    EndHour: TlvField(5, TlvUInt8),
    EndMinute: TlvField(6, TlvUInt8)
});

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const GetWeekDayScheduleResponseRequest = TlvObject({
    WeekDayIndex: TlvField(0, TlvUInt8),
    UserIndex: TlvField(1, TlvUInt16),
    Status: TlvField(2, TlvEnum<DlStatus>()),
    DaysMask: TlvOptionalField(3, DaysMaskMap),
    StartHour: TlvOptionalField(4, TlvUInt8),
    StartMinute: TlvOptionalField(5, TlvUInt8),
    EndHour: TlvOptionalField(6, TlvUInt8),
    EndMinute: TlvOptionalField(7, TlvUInt8)
});

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const GetWeekDayScheduleRequest = TlvObject({
    WeekDayIndex: TlvField(0, TlvUInt8),
    UserIndex: TlvField(1, TlvUInt16)
});

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const ClearWeekDayScheduleRequest = TlvObject({
    WeekDayIndex: TlvField(0, TlvUInt8),
    UserIndex: TlvField(1, TlvUInt16)
});

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const SetYearDayScheduleRequest = TlvObject({
    YearDayIndex: TlvField(0, TlvUInt8),
    UserIndex: TlvField(1, TlvUInt16),
    LocalStartTime: TlvField(2, TlvUInt32),
    LocalEndTime: TlvField(3, TlvUInt32)
});

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const GetYearDayScheduleResponseRequest = TlvObject({
    YearDayIndex: TlvField(0, TlvUInt8),
    UserIndex: TlvField(1, TlvUInt16),
    Status: TlvField(2, TlvEnum<DlStatus>()),
    LocalStartTime: TlvOptionalField(3, TlvUInt32),
    LocalEndTime: TlvOptionalField(4, TlvUInt32)
});

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const GetYearDayScheduleRequest = TlvObject({
    YearDayIndex: TlvField(0, TlvUInt8),
    UserIndex: TlvField(1, TlvUInt16)
});

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const ClearYearDayScheduleRequest = TlvObject({
    YearDayIndex: TlvField(0, TlvUInt8),
    UserIndex: TlvField(1, TlvUInt16)
});

/**
 * The OperatingMode enumeration shall indicate the lock operating mode.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.12
 */
export const enum OperatingModeEnum {
    /**
     * The lock operates normally. All interfaces are enabled.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.12.1
     */
    Normal = 0,

    /**
     * Only remote interaction is enabled. The keypad SHALL only be operable by
     * the master user.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.12.2
     */
    Vacation = 1,

    /**
     * This mode is only possible if the door is locked. Manual unlocking
     * changes the mode to Normal operating mode. All external interaction with
     * the door lock is disabled. This mode is intended to be used so that
     * users, presumably inside the property, will have control over the
     * entrance.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.12.3
     */
    Privacy = 2,

    /**
     * This mode only disables remote interaction with the lock. This does not
     * apply to any remote proprietary means of communication. It specifically
     * applies to the Lock, Unlock, Toggle, and Unlock with Timeout Commands.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.12.4
     */
    NoRemoteLockUnlock = 3,

    /**
     * The lock is open or can be opened or closed at will without the use of a
     * Keypad or other means of user validation (e.g. a lock for a business
     * during work hours).
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.6.12.5
     */
    Passage = 4
};

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const SetHolidayScheduleRequest = TlvObject({
    HolidayIndex: TlvField(0, TlvUInt8),
    LocalStartTime: TlvField(1, TlvUInt32),
    LocalEndTime: TlvField(2, TlvUInt32),
    OperatingMode: TlvField(3, TlvEnum<OperatingModeEnum>())
});

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const GetHolidayScheduleResponseRequest = TlvObject({
    HolidayIndex: TlvField(0, TlvUInt8),
    Status: TlvField(1, TlvEnum<DlStatus>()),
    LocalStartTime: TlvOptionalField(2, TlvUInt32),
    LocalEndTime: TlvOptionalField(3, TlvUInt32),
    OperatingMode: TlvOptionalField(4, TlvEnum<OperatingModeEnum>())
});

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const GetHolidayScheduleRequest = TlvObject({ HolidayIndex: TlvField(0, TlvUInt8) });

/**
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
 */
export const ClearHolidayScheduleRequest = TlvObject({ HolidayIndex: TlvField(0, TlvUInt8) });

/**
 * Event mask used to turn on and off the transmission of keypad operation
 * events. This mask DOES NOT apply to the storing of events in the event log.
 * This mask only applies to the Operation Event Notification Command.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.40
 */
export const KeypadOperationEventMaskBits = {
    UnknownOrManufacturerSpecificKeypadOperationEvent: BitFlag(0),
    LockSourceKeypad: BitFlag(1),
    UnlockSourceKeypad: BitFlag(2),
    LockSourceKeypadErrorInvalidPin: BitFlag(3),
    LockSourceKeypadErrorInvalidSchedule: BitFlag(4),
    UnlockSourceKeypadErrorInvalidCode: BitFlag(5),
    UnlockSourceKeypadErrorInvalidSchedule: BitFlag(6),
    NonAccessUserOperationEventSourceKeypad: BitFlag(15)
};

export const KeypadOperationEventMask = TlvBitmap(TlvUInt16, KeypadOperationEventMaskBits);

/**
 * Event mask used to turn on and off keypad programming events. This mask DOES
 * NOT apply to the storing of events in the event log. This mask only applies
 * to the Programming Event Notification Command.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.44
 */
export const KeypadProgrammingEventMaskBits = {
    UnknownOrManufacturerSpecificKeypadProgrammingEvent: BitFlag(0),
    ProgrammingPinCodeChangedSourceKeypad: BitFlag(1),
    PinAddedSourceKeypad: BitFlag(2),
    PinClearedSourceKeypad: BitFlag(3),
    PinChangedSourceKeypad: BitFlag(4)
};

export const KeypadProgrammingEventMask = TlvBitmap(TlvUInt16, KeypadProgrammingEventMaskBits);

/**
 * Event mask used to turn on and off the transmission of remote operation
 * events. This mask DOES NOT apply to the storing of events in the event log.
 * This mask only applies to the Operation Event
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.41
 */
export const RemoteOperationEventMaskBits = {
    UnknownOrManufacturerSpecificRemoteOperationEvent: BitFlag(0),
    LockSourceRemote: BitFlag(1),
    UnlockSourceRemote: BitFlag(2),
    LockSourceRemoteErrorInvalidCode: BitFlag(3),
    LockSourceRemoteErrorInvalidSchedule: BitFlag(4),
    UnlockSourceRemoteErrorInvalidCode: BitFlag(5),
    UnlockSourceRemoteErrorInvalidSchedule: BitFlag(6)
};

export const RemoteOperationEventMask = TlvBitmap(TlvUInt16, RemoteOperationEventMaskBits);

/**
 * Event mask used to turn on and off manual operation events. This mask DOES
 * NOT apply to the storing of events in the event log. This mask only applies
 * to the Operation Event Notification Command.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.42
 */
export const ManualOperationEventMaskBits = {
    UnknownOrManufacturerSpecificManualOperationEvent: BitFlag(0),
    ThumbturnLock: BitFlag(1),
    ThumbturnUnlock: BitFlag(2),
    OneTouchLock: BitFlag(7),
    KeyLock: BitFlag(8),
    KeyUnlock: BitFlag(9),
    AutoLock: BitFlag(10),
    ScheduleLock: BitFlag(11),
    ScheduleUnlock: BitFlag(12),
    ManualLock: BitFlag(13),
    ManualUnlock: BitFlag(14)
};

export const ManualOperationEventMask = TlvBitmap(TlvUInt16, ManualOperationEventMaskBits);

/**
 * Event mask used to turn on and off remote programming events. This mask DOES
 * NOT apply to the storing of events in the event log. This mask only applies
 * to the Programming Event Notification Command.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.45
 */
export const RemoteProgrammingEventMaskBits = {
    UnknownOrManufacturerSpecificRemoteProgrammingEvent: BitFlag(0),
    PinAddedSourceRemote: BitFlag(2),
    PinClearedSourceRemote: BitFlag(3),
    PinChangedSourceRemote: BitFlag(4),
    RfidCodeAddedSourceRemote: BitFlag(5),
    RfidCodeClearedSourceRemote: BitFlag(6)
};

export const RemoteProgrammingEventMask = TlvBitmap(TlvUInt16, RemoteProgrammingEventMaskBits);

/**
 * Event mask used to turn on and off RFID operation events. This mask DOES NOT
 * apply to the storing of events in the event log. This mask only applies to
 * the Operation Event Notification Command.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.43
 */
export const RfidOperationEventMaskBits = {
    UnknownOrManufacturerSpecificKeypadOperationEvent: BitFlag(0),
    LockSourceRfid: BitFlag(1),
    UnlockSourceRfid: BitFlag(2),
    LockSourceRfidErrorInvalidRfidId: BitFlag(3),
    LockSourceRfidErrorInvalidSchedule: BitFlag(4),
    UnlockSourceRfidErrorInvalidRfidId: BitFlag(5),
    UnlockSourceRfidErrorInvalidSchedule: BitFlag(6)
};

export const RfidOperationEventMask = TlvBitmap(TlvUInt16, RfidOperationEventMaskBits);

export namespace DoorLockCluster {
    export const id = 257;
    export const name = "DoorLock";
    export const revision = 1;

    export const featureMap = {
        /**
         * PinCredential
         *
         * Lock supports PIN credentials (via keypad, or over- the-air)
         */
        pinCredential: BitFlag(0),

        /**
         * RfidCredential
         *
         * Lock supports RFID credentials
         */
        rfidCredential: BitFlag(1),

        /**
         * FingerCredentials
         *
         * Lock supports finger related credentials (fingerprint, finger vein)
         */
        fingerCredentials: BitFlag(2),

        /**
         * Logging
         *
         * Lock supports local/on-lock logging when Events are not supported
         */
        logging: BitFlag(3),

        /**
         * WeekDayAccessSchedules
         *
         * Lock supports week day user access schedules
         */
        weekDayAccessSchedules: BitFlag(4),

        /**
         * DoorPositionSensor
         *
         * Lock supports a door position sensor that indicates door’s state
         */
        doorPositionSensor: BitFlag(5),

        /**
         * FaceCredentials
         *
         * Lock supports face related credentials (face, iris, retina)
         */
        faceCredentials: BitFlag(6),

        /**
         * CredentialOverTheAirAccess
         *
         * PIN codes over- the-air supported for lock/unlock operations
         */
        credentialOverTheAirAccess: BitFlag(7),

        /**
         * User
         *
         * Lock supports the user commands and database
         */
        user: BitFlag(8),

        /**
         * Notification
         *
         * Operation and Programming Notifications
         */
        notification: BitFlag(9),

        /**
         * YearDayAccessSchedules
         *
         * Lock supports year day user access schedules
         */
        yearDayAccessSchedules: BitFlag(10),

        /**
         * HolidaySchedules
         *
         * Lock supports holiday schedules
         */
        holidaySchedules: BitFlag(11)
    };

    const Base = {
        attributes: {
            /**
             * This attribute has the following possible values:
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.1
             */
            lockState: Attribute(0, TlvNullable(TlvEnum<LockState>()), { scene: true, readAcl: AccessLevel.View }),

            /**
             * The LockType attribute is indicated by an enumeration:
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.2
             */
            lockType: Attribute(1, TlvEnum<LockType>(), { readAcl: AccessLevel.View }),

            /**
             * The ActuatorEnabled attribute indicates if the lock is currently
             * able to (Enabled) or not able to (Disabled) process remote Lock,
             * Unlock, or Unlock with Timeout commands.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.3
             */
            actuatorEnabled: Attribute(2, TlvBoolean, { readAcl: AccessLevel.View }),

            /**
             * Modifies the language for the on-screen or audible user
             * interface using a 2-byte language code from ISO-639-1.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.22
             */
            language: OptionalWritableAttribute(33, TlvString.bound({ maxLength: 3 }), { readAcl: AccessLevel.View, writeAcl: AccessLevel.Manage }),

            /**
             * The settings for the LED support three different modes, shown
             * below:
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.25
             */
            ledSettings: OptionalWritableAttribute(34, TlvUInt8, { readAcl: AccessLevel.View, writeAcl: AccessLevel.Manage }),

            /**
             * The number of seconds to wait after unlocking a lock before it
             * automatically locks again. 0=disabled. If set, unlock operations
             * from any source will be timed. For one time unlock with timeout
             * use the specific command.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.26
             */
            autoRelockTime: OptionalWritableAttribute(35, TlvUInt32, { readAcl: AccessLevel.View, writeAcl: AccessLevel.Manage }),

            /**
             * The sound volume on a door lock has four possible settings:
             * silent, low, high and medium volumes, shown below:
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.27
             */
            soundVolume: OptionalWritableAttribute(36, TlvUInt8, { readAcl: AccessLevel.View, writeAcl: AccessLevel.Manage }),

            /**
             * The current operating mode of the lock (see OperatingModeEnum).
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.23
             */
            operatingMode: WritableAttribute(37, TlvUInt8, { readAcl: AccessLevel.View, writeAcl: AccessLevel.Manage }),

            /**
             * This bitmap contains all operating bits of the Operating Mode
             * Attribute supported by the lock. All operating modes NOT
             * supported by a lock SHALL be set to one. The value of the
             * OperatingMode enumeration defines the related bit to be set, as
             * shown below:
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.24
             */
            supportedOperatingModes: FixedAttribute(38, SupportedOperatingModes, { default: BitFlags(SupportedOperatingModesBits, "Privacy", "Passage"), readAcl: AccessLevel.View }),

            /**
             * This attribute represents the default configurations as they are
             * physically set on the device (example: hardware dip switch
             * setting, etc…) and represents the default setting for some of
             * the attributes within this cluster (for example: LED, Auto Lock,
             * Sound Volume, and Operating Mode attributes).
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.28
             */
            defaultConfigurationRegister: OptionalAttribute(39, DefaultConfigurationRegister, { readAcl: AccessLevel.View }),

            /**
             * Enable/disable local programming on the door lock of certain
             * features (see LocalProgrammingFeatures attribute). If this value
             * is set to TRUE then local programming is enabled on the door
             * lock for all features. If it is set to FALSE then local
             * programming is disabled on the door lock for those features
             * whose bit is set to 0 in the LocalProgrammingFeatures attribute.
             * Local programming SHALL be enabled by default.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.29
             */
            enableLocalProgramming: OptionalWritableAttribute(40, TlvBoolean, { default: true, readAcl: AccessLevel.View, writeAcl: AccessLevel.Administer }),

            /**
             * Enable/disable the ability to lock the door lock with a single
             * touch on the door lock.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.30
             */
            enableOneTouchLocking: OptionalWritableAttribute(41, TlvBoolean, { default: true, readAcl: AccessLevel.View, writeAcl: AccessLevel.Manage }),

            /**
             * Enable/disable an inside LED that allows the user to see at a
             * glance if the door is locked.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.31
             */
            enableInsideStatusLed: OptionalWritableAttribute(42, TlvBoolean, { default: true, readAcl: AccessLevel.View, writeAcl: AccessLevel.Manage }),

            /**
             * Enable/disable a button inside the door that is used to put the
             * lock into privacy mode. When the lock is in privacy mode it
             * cannot be manipulated from the outside.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.32
             */
            enablePrivacyModeButton: OptionalWritableAttribute(43, TlvBoolean, { default: true, readAcl: AccessLevel.View, writeAcl: AccessLevel.Manage }),

            /**
             * The local programming features that will be disabled when
             * EnableLocalProgramming attribute is set to False. If a door lock
             * doesn’t support disabling one aspect of local programming it
             * SHALL return CONSTRAINT_ERROR during a write operation of this
             * attribute. If the EnableLocalProgramming attribute is set to
             * True then all local programming features SHALL be enabled
             * regardless of the bits set to 0 in this attribute.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.33
             */
            localProgrammingFeatures: OptionalWritableAttribute(44, LocalProgrammingFeatures, { readAcl: AccessLevel.View, writeAcl: AccessLevel.Administer }),

            /**
             * This attribute is only supported if the Alarms cluster is on the
             * same endpoint. The alarm mask is used to turn on/off alarms for
             * particular functions. Alarms for an alarm group are enabled if
             * the associated alarm mask bit is set. Each bit represents a
             * group of alarms. Entire alarm groups can be turned on or off by
             * setting or clearing the associated bit in the alarm mask.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.39
             */
            alarmMask: OptionalWritableAttribute(64, AlarmMask, { default: BitFlags(AlarmMaskBits, "LockResetToFactoryDefaults", "Reserved", "TamperAlarmWrongCodeEntryLimit"), readAcl: AccessLevel.View, writeAcl: AccessLevel.Administer })
        },

        commands: {
            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            lockDoor: Command(0, LockDoorRequest, 0, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            unlockDoor: Command(1, UnlockDoorRequest, 1, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            unlockWithTimeout: OptionalCommand(3, UnlockWithTimeoutRequest, 3, TlvNoResponse)
        },

        events: {
            /**
             * The door lock cluster provides several alarms which can be sent
             * when there is a critical state on the door lock. The alarms
             * available for the door lock cluster are listed in the
             * AlarmCodeEnum section below.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.1
             */
            doorLockAlarm: Event(0, EventPriority.Critical, DoorLockAlarmEvent),

            /**
             * The door lock server sends out a LockOperation event when the
             * event is triggered by the various lock operation sources.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.3
             */
            lockOperation: Event(2, EventPriority.Critical, LockOperationEvent),

            /**
             * The door lock server sends out a LockOperationError event when a
             * lock operation fails for various reasons.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.4
             */
            lockOperationError: Event(3, EventPriority.Critical, LockOperationErrorEvent)
        }
    };

    const DoorPositionSensor = {
        attributes: {
            /**
             * The current door state as defined in DoorStateEnum.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.4
             */
            doorState: Attribute(3, TlvNullable(TlvUInt8), { readAcl: AccessLevel.View }),

            /**
             * This attribute holds the number of door open events that have
             * occurred since it was last zeroed.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.5
             */
            doorOpenEvents: OptionalWritableAttribute(4, TlvUInt32, { readAcl: AccessLevel.View, writeAcl: AccessLevel.Manage }),

            /**
             * This attribute holds the number of door closed events that have
             * occurred since it was last zeroed.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.6
             */
            doorClosedEvents: OptionalWritableAttribute(5, TlvUInt32, { readAcl: AccessLevel.View, writeAcl: AccessLevel.Manage }),

            /**
             * This attribute holds the number of minutes the door has been
             * open since the last time it transitioned from closed to open.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.7
             */
            openPeriod: OptionalWritableAttribute(6, TlvUInt16, { readAcl: AccessLevel.View, writeAcl: AccessLevel.Manage })
        },

        events: {
            /**
             * The door lock server sends out a DoorStateChange event when the
             * door lock door state changes. The data of this event SHALL
             * contain the following information:
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.2
             */
            doorStateChange: Event(1, EventPriority.Critical, DoorStateChangeEvent)
        }
    };

    const Logging = {
        attributes: {
            /**
             * The number of available log records.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.8
             */
            numberOfLogRecordsSupported: FixedAttribute(16, TlvUInt16, { readAcl: AccessLevel.View }),

            /**
             * Enable/disable event logging. When event logging is enabled, all
             * event messages are stored on the lock for retrieval. Logging
             * events can be but not limited to Tamper Alarm, Lock, Unlock,
             * AutoRelock, User Code Added, User Code Cleared, Schedule Added,
             * and Schedule Cleared. For a full detail of all the possible
             * alarms and events, please refer to the full list in the Alarm
             * and Event Masks Attribute Set.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.21
             */
            enableLogging: WritableAttribute(32, TlvBoolean, { default: true, readAcl: AccessLevel.View, writeAcl: AccessLevel.Administer })
        },

        commands: {
            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            getLogRecord: Command(4, TlvNoArguments, 4, TlvNoArguments),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            getLogRecordResponse: Command(4, TlvNoArguments, 4, TlvNoResponse)
        }
    };

    const User = {
        attributes: {
            /**
             * Number of total users supported by the lock.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.9
             */
            numberOfTotalUsersSupported: FixedAttribute(17, TlvUInt16, { readAcl: AccessLevel.View }),

            /**
             * This bitmap contains a bit for every value of CredentialRuleEnum
             * supported on this device.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.19
             */
            credentialRulesSupport: FixedAttribute(27, CredentialRulesSupport, { default: BitFlags(CredentialRulesSupportBits, "Dual"), readAcl: AccessLevel.View }),

            /**
             * The number of credentials that could be assigned for each user.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.20
             */
            numberOfCredentialsSupportedPerUser: FixedAttribute(28, TlvUInt8, { readAcl: AccessLevel.View }),

            /**
             * Number of minutes a PIN, RFID, Fingerprint, or other credential
             * associated with a user of type ExpiringUser SHALL remain valid
             * after its first use before expiring. When the credential expires
             * the UserStatus for the corresponding user record SHALL be set to
             * OccupiedDisabled.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.38
             */
            expiringUserTimeout: OptionalWritableAttribute(53, TlvUInt16, { readAcl: AccessLevel.View, writeAcl: AccessLevel.Administer })
        },

        commands: {
            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            setUser: Command(26, SetUserRequest, 26, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            getUser: Command(27, GetUserRequest, 28, GetUserResponseRequest),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            getUserResponse: Command(28, GetUserResponseRequest, 28, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            clearUser: Command(29, ClearUserRequest, 29, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            setCredential: Command(34, SetCredentialRequest, 35, SetCredentialResponseRequest),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            setCredentialResponse: Command(35, SetCredentialResponseRequest, 35, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            getCredentialStatus: Command(36, GetCredentialStatusRequest, 37, GetCredentialStatusResponseRequest),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            getCredentialStatusResponse: Command(37, GetCredentialStatusResponseRequest, 37, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            clearCredential: Command(38, ClearCredentialRequest, 38, TlvNoResponse)
        },

        events: {
            /**
             * The door lock server sends out a LockUserChange event when a
             * lock user, schedule, or credential change has occurred.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.5.5
             */
            lockUserChange: Event(4, EventPriority.Info, LockUserChangeEvent)
        }
    };

    const PinCredential = {
        attributes: {
            /**
             * The number of PIN users supported.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.10
             */
            numberOfPinUsersSupported: FixedAttribute(18, TlvUInt16, { readAcl: AccessLevel.View }),

            /**
             * An 8 bit value indicates the maximum length in bytes of a PIN
             * Code on this device.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.15
             */
            maxPinCodeLength: FixedAttribute(23, TlvUInt8, { readAcl: AccessLevel.View }),

            /**
             * An 8 bit value indicates the minimum length in bytes of a PIN
             * Code on this device.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.16
             */
            minPinCodeLength: FixedAttribute(24, TlvUInt8, { readAcl: AccessLevel.View }),

            /**
             * Boolean set to True if it is ok for the door lock server to send
             * PINs over the air. This attribute determines the behavior of the
             * server’s TX operation. If it is false, then it is not ok for the
             * device to send PIN in any messages over the air.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.36
             */
            sendPinOverTheAir: OptionalWritableAttribute(50, TlvBoolean, { default: true, readAcl: AccessLevel.View, writeAcl: AccessLevel.Administer })
        }
    };

    const RfidCredential = {
        attributes: {
            /**
             * The number of RFID users supported.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.11
             */
            numberOfRfidUsersSupported: FixedAttribute(19, TlvUInt16, { readAcl: AccessLevel.View }),

            /**
             * An 8 bit value indicates the maximum length in bytes of a RFID
             * Code on this device. The value depends on the RFID code range
             * specified by the manufacturer, if media anti-collision
             * identifiers (UID) are used as RFID code, a value of 20 (equals
             * 10 Byte ISO 14443A UID) is recommended.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.17
             */
            maxRfidCodeLength: FixedAttribute(25, TlvUInt8, { readAcl: AccessLevel.View }),

            /**
             * An 8 bit value indicates the minimum length in bytes of a RFID
             * Code on this device. The value depends on the RFID code range
             * specified by the manufacturer, if media anti-collision
             * identifiers (UID) are used as RFID code, a value of 8 (equals 4
             * Byte ISO 14443A UID) is recommended.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.18
             */
            minRfidCodeLength: FixedAttribute(26, TlvUInt8, { readAcl: AccessLevel.View })
        }
    };

    const WeekDayAccessSchedules = {
        attributes: {
            /**
             * The number of configurable week day schedule supported per user.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.12
             */
            numberOfWeekDaySchedulesSupportedPerUser: FixedAttribute(20, TlvUInt8, { readAcl: AccessLevel.View })
        },

        commands: {
            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            setWeekDaySchedule: Command(11, SetWeekDayScheduleRequest, 11, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            getWeekDaySchedule: Command(12, GetWeekDayScheduleRequest, 12, GetWeekDayScheduleResponseRequest),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            getWeekDayScheduleResponse: Command(12, GetWeekDayScheduleResponseRequest, 12, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            clearWeekDaySchedule: Command(13, ClearWeekDayScheduleRequest, 13, TlvNoResponse)
        }
    };

    const YearDayAccessSchedules = {
        attributes: {
            /**
             * The number of configurable year day schedule supported per user.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.13
             */
            numberOfYearDaySchedulesSupportedPerUser: FixedAttribute(21, TlvUInt8, { readAcl: AccessLevel.View })
        },

        commands: {
            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            setYearDaySchedule: Command(14, SetYearDayScheduleRequest, 14, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            getYearDaySchedule: Command(15, GetYearDayScheduleRequest, 15, GetYearDayScheduleResponseRequest),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            getYearDayScheduleResponse: Command(15, GetYearDayScheduleResponseRequest, 15, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            clearYearDaySchedule: Command(16, ClearYearDayScheduleRequest, 16, TlvNoResponse)
        }
    };

    const HolidaySchedules = {
        attributes: {
            /**
             * The number of holiday schedules supported for the entire door
             * lock device.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.14
             */
            numberOfHolidaySchedulesSupported: FixedAttribute(22, TlvUInt8, { readAcl: AccessLevel.View })
        },

        commands: {
            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            setHolidaySchedule: Command(17, SetHolidayScheduleRequest, 17, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            getHolidaySchedule: Command(18, GetHolidayScheduleRequest, 18, GetHolidayScheduleResponseRequest),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            getHolidayScheduleResponse: Command(18, GetHolidayScheduleResponseRequest, 18, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            clearHolidaySchedule: Command(19, ClearHolidayScheduleRequest, 19, TlvNoResponse)
        }
    };

    const PinCredentialOrRfidCredential = {
        attributes: {
            /**
             * The number of incorrect Pin codes or RFID presentment attempts a
             * user is allowed to enter before the lock will enter a lockout
             * state. The value of this attribute is compared to all failing
             * forms of credential presentation, including Pin codes used in an
             * Unlock Command when RequirePINforRemoteOperation is set to true.
             * Valid range is 1-255 incorrect attempts. The lockout state will
             * be for the duration of UserCodeTemporaryDisableTime. If the
             * attribute accepts writes and an attempt to write the value 0 is
             * made, the device SHALL respond with CONSTRAINT_ERROR.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.34
             */
            wrongCodeEntryLimit: WritableAttribute(48, TlvUInt8, { readAcl: AccessLevel.View, writeAcl: AccessLevel.Administer }),

            /**
             * The number of seconds that the lock shuts down following wrong
             * code entry. Valid range is 1-255 seconds. Device can shut down
             * to lock user out for specified amount of time. (Makes it
             * difficult to try and guess a PIN for the device.) If the
             * attribute accepts writes and an attempt to write the attribute
             * to 0 is made, the device SHALL respond with CONSTRAINT_ERROR.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.35
             */
            userCodeTemporaryDisableTime: WritableAttribute(49, TlvUInt8, { readAcl: AccessLevel.View, writeAcl: AccessLevel.Administer })
        }
    };

    const CredentialOverTheAirAccessAndPinCredential = {
        attributes: {
            /**
             * Boolean set to True if the door lock server requires that an
             * optional PINs be included in the payload of remote lock
             * operation events like Lock, Unlock, Unlock with Timeout and
             * Toggle in order to function.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.37
             */
            requirePiNforRemoteOperation: WritableAttribute(51, TlvBoolean, { default: true, readAcl: AccessLevel.View, writeAcl: AccessLevel.Administer })
        }
    };

    const NotificationAndPinCredential = {
        attributes: {
            /**
             * Event mask used to turn on and off the transmission of keypad
             * operation events. This mask DOES NOT apply to the storing of
             * events in the event log. This mask only applies to the Operation
             * Event Notification Command.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.40
             */
            keypadOperationEventMask: OptionalWritableAttribute(65, KeypadOperationEventMask, { default: BitFlags(KeypadOperationEventMaskBits, "LockSourceKeypad", "UnlockSourceKeypad", "LockSourceKeypadErrorInvalidSchedule"), readAcl: AccessLevel.View, writeAcl: AccessLevel.Administer }),

            /**
             * Event mask used to turn on and off keypad programming events.
             * This mask DOES NOT apply to the storing of events in the event
             * log. This mask only applies to the Programming Event
             * Notification Command.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.44
             */
            keypadProgrammingEventMask: OptionalWritableAttribute(69, KeypadProgrammingEventMask, { default: BitFlags(KeypadProgrammingEventMaskBits, "ProgrammingPinCodeChangedSourceKeypad", "PinAddedSourceKeypad", "PinChangedSourceKeypad"), readAcl: AccessLevel.View, writeAcl: AccessLevel.Administer })
        }
    };

    const Notification = {
        attributes: {
            /**
             * Event mask used to turn on and off the transmission of remote
             * operation events. This mask DOES NOT apply to the storing of
             * events in the event log. This mask only applies to the Operation
             * Event
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.41
             */
            remoteOperationEventMask: OptionalWritableAttribute(66, RemoteOperationEventMask, { default: BitFlags(RemoteOperationEventMaskBits, "LockSourceRemote", "UnlockSourceRemote", "LockSourceRemoteErrorInvalidSchedule"), readAcl: AccessLevel.View, writeAcl: AccessLevel.Administer }),

            /**
             * Event mask used to turn on and off manual operation events. This
             * mask DOES NOT apply to the storing of events in the event log.
             * This mask only applies to the Operation Event Notification
             * Command.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.42
             */
            manualOperationEventMask: OptionalWritableAttribute(67, ManualOperationEventMask, { default: BitFlags(ManualOperationEventMaskBits, "ThumbturnLock", "ThumbturnUnlock", "KeyLock"), readAcl: AccessLevel.View, writeAcl: AccessLevel.Administer }),

            /**
             * Event mask used to turn on and off remote programming events.
             * This mask DOES NOT apply to the storing of events in the event
             * log. This mask only applies to the Programming Event
             * Notification Command.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.45
             */
            remoteProgrammingEventMask: OptionalWritableAttribute(70, RemoteProgrammingEventMask, { default: BitFlags(RemoteProgrammingEventMaskBits, "PinAddedSourceRemote", "PinChangedSourceRemote"), readAcl: AccessLevel.View, writeAcl: AccessLevel.Administer })
        },

        commands: {
            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            operatingEventNotification: OptionalCommand(32, TlvNoArguments, 32, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            programmingEventNotification: OptionalCommand(33, TlvNoArguments, 33, TlvNoResponse)
        }
    };

    const NotificationAndRfidCredential = {
        attributes: {
            /**
             * Event mask used to turn on and off RFID operation events. This
             * mask DOES NOT apply to the storing of events in the event log.
             * This mask only applies to the Operation Event Notification
             * Command.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3.43
             */
            rfidOperationEventMask: OptionalWritableAttribute(68, RfidOperationEventMask, { default: BitFlags(RfidOperationEventMaskBits, "LockSourceRfid", "UnlockSourceRfid", "LockSourceRfidErrorInvalidSchedule"), readAcl: AccessLevel.View, writeAcl: AccessLevel.Administer }),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.3
             */
            rfidPro: OptionalWritableAttribute(71, TlvUInt16, { readAcl: AccessLevel.View, writeAcl: AccessLevel.Administer })
        }
    };

    const PinCredentialNotUser = {
        commands: {
            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            setPinCode: Command(5, TlvNoArguments, 5, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            getPinCode: Command(6, TlvNoArguments, 6, TlvNoArguments),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            getPinCodeResponse: Command(6, TlvNoArguments, 6, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            clearPinCode: Command(7, TlvNoArguments, 7, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            clearAllPinCodes: Command(8, TlvNoArguments, 8, TlvNoResponse)
        }
    };

    const PinCredentialAndRfidCredentialNotUser = {
        commands: {
            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            setUserStatus: OptionalCommand(9, TlvNoArguments, 9, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            getUserStatus: OptionalCommand(10, TlvNoArguments, 10, TlvNoArguments),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            setUserType: OptionalCommand(20, TlvNoArguments, 20, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            getUserType: OptionalCommand(21, TlvNoArguments, 21, TlvNoArguments)
        }
    };

    const NotUser = {
        commands: {
            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            getUserStatusResponse: Command(10, TlvNoArguments, 10, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            getUserTypeResponse: Command(21, TlvNoArguments, 21, TlvNoResponse)
        }
    };

    const RfidCredentialNotUser = {
        commands: {
            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            setRfidCode: Command(22, TlvNoArguments, 22, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            getRfidCode: Command(23, TlvNoArguments, 23, TlvNoArguments),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            getRfidCodeResponse: Command(23, TlvNoArguments, 23, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            clearRfidCode: Command(24, TlvNoArguments, 24, TlvNoResponse),

            /**
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 5.2.4
             */
            clearAllRfidCodes: Command(25, TlvNoArguments, 25, TlvNoResponse)
        }
    };

    export const Complete = BuildCluster({
        id,
        name,
        revision,
        features: featureMap,

        supportedFeatures: {
            pinCredential: true,
            rfidCredential: true,
            fingerCredentials: true,
            logging: true,
            weekDayAccessSchedules: true,
            doorPositionSensor: true,
            faceCredentials: true,
            credentialOverTheAirAccess: true,
            user: true,
            notification: true,
            yearDayAccessSchedules: true,
            holidaySchedules: true
        },

        elements: [
            Base,
            DoorPositionSensor,
            Logging,
            User,
            PinCredential,
            RfidCredential,
            WeekDayAccessSchedules,
            YearDayAccessSchedules,
            HolidaySchedules,
            PinCredentialOrRfidCredential,
            CredentialOverTheAirAccessAndPinCredential,
            NotificationAndPinCredential,
            Notification,
            NotificationAndRfidCredential,
            PinCredentialNotUser,
            PinCredentialAndRfidCredentialNotUser,
            NotUser,
            RfidCredentialNotUser
        ]
    });
};