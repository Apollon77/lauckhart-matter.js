/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { MatterApplicationClusterSpecificationV1_1 } from "../../spec/Specifications.js";
import { GlobalAttributes, FixedAttribute, Command, TlvNoResponse, Cluster } from "../../cluster/Cluster.js";
import { ClusterMetadata, ClusterComponent } from "../../cluster/ClusterFactory.js";
import { BitFlag } from "../../schema/BitmapSchema.js";
import { TlvUInt8, TlvBitmap, TlvUInt16 } from "../../tlv/TlvNumber.js";
import { TlvObject, TlvField } from "../../tlv/TlvObject.js";
import { TlvString } from "../../tlv/TlvString.js";
import { TlvArray } from "../../tlv/TlvArray.js";
import { TlvNullable } from "../../tlv/TlvNullable.js";
import { TlvNoArguments } from "../../tlv/TlvNoArguments.js";

/**
 * Groups
 *
 * Attributes and commands for group configuration and manipulation.
 *
 * Use this factory function to create a Groups cluster.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3
 */
export function GroupsCluster() {
    const cluster = Cluster({ ...GroupsCluster.Metadata, ...GroupsCluster.BaseComponent });
    return cluster as unknown as GroupsCluster.Type;
}

/**
 * Bit definitions for TlvNameSupport
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.6.1
 */
export const NameSupportBits = {
    /**
     * The ability to store a name for a group.
     */
    groupNames: BitFlag(7)
};

/**
 * The value of the Groups nameSupport attribute
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.6.1
 */
export const TlvNameSupport = TlvBitmap(TlvUInt8, NameSupportBits);

/**
 * Input to the Groups addGroup command
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.7.1
 */
export const TlvAddGroupRequest = TlvObject({
    groupId: TlvField(0, TlvUInt16.bound({ min: 1 })),
    groupName: TlvField(1, TlvString.bound({ maxLength: 16 }))
});

/**
 * Input to the Groups addGroupResponse command
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.7.7
 */
export const TlvAddGroupResponse = TlvObject({
    status: TlvField(0, TlvUInt8),
    groupId: TlvField(1, TlvUInt16.bound({ min: 1 }))
});

/**
 * Input to the Groups viewGroup command
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.7.2
 */
export const TlvViewGroupRequest = TlvObject({ groupId: TlvField(0, TlvUInt16.bound({ min: 1 })) });

/**
 * Input to the Groups viewGroupResponse command
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.7.8
 */
export const TlvViewGroupResponse = TlvObject({
    status: TlvField(0, TlvUInt8),
    groupId: TlvField(1, TlvUInt16.bound({ min: 1 })),
    groupName: TlvField(2, TlvString.bound({ maxLength: 16 }))
});

/**
 * Input to the Groups getGroupMembership command
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.7.3
 */
export const TlvGetGroupMembershipRequest = TlvObject({ groupList: TlvField(0, TlvArray(TlvUInt16)) });

/**
 * Input to the Groups getGroupMembershipResponse command
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.7.9
 */
export const TlvGetGroupMembershipResponse = TlvObject({
    capacity: TlvField(0, TlvNullable(TlvUInt8)),
    groupList: TlvField(1, TlvArray(TlvUInt16))
});

/**
 * Input to the Groups removeGroup command
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.7.4
 */
export const TlvRemoveGroupRequest = TlvObject({ groupId: TlvField(0, TlvUInt16.bound({ min: 1 })) });

/**
 * Input to the Groups removeGroupResponse command
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.7.10
 */
export const TlvRemoveGroupResponse = TlvObject({
    status: TlvField(0, TlvUInt8),
    groupId: TlvField(1, TlvUInt16.bound({ min: 1 }))
});

/**
 * Input to the Groups addGroupIfIdentifying command
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.7.6
 */
export const TlvAddGroupIfIdentifyingRequest = TlvObject({
    groupId: TlvField(0, TlvUInt16.bound({ min: 1 })),
    groupName: TlvField(1, TlvString.bound({ maxLength: 16 }))
});

export namespace GroupsCluster {
    /**
     * These are optional features supported by GroupsCluster.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.4
     */
    export enum Feature {
        /**
         * GroupNames
         *
         * The ability to store a name for a group.
         */
        GroupNames = "GroupNames"
    }

    export type Type =
        typeof Metadata
        & { attributes: GlobalAttributes<{}> }
        & typeof BaseComponent;

    /**
     * Groups cluster metadata.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3
     */
    export const Metadata = ClusterMetadata({
        id: 0x4,
        name: "Groups",
        revision: 1,

        features: {
            /**
             * GroupNames
             *
             * The ability to store a name for a group.
             */
            groupNames: BitFlag(0)
        }
    });

    /**
     * A GroupsCluster supports these elements for all feature combinations.
     */
    export const BaseComponent = ClusterComponent({
        attributes: {
            /**
             * This attribute provides legacy, read-only access to whether the Group Names feature is supported. The
             * most significant bit, bit 7, shall be equal to bit 0 of the FeatureMap attribute. All other bits shall
             * be 0.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.6.1
             */
            nameSupport: FixedAttribute(0, TlvNameSupport)
        },

        commands: {
            /**
             * The AddGroup command allows a client to add group membership in a particular group for the server
             * endpoint.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.7.1
             */
            addGroup: Command(0, TlvAddGroupRequest, 0, TlvAddGroupResponse),

            /**
             * The AddGroupResponse is sent by the Groups cluster server in response to an AddGroup command.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.7.7
             */
            addGroupResponse: Command(0, TlvAddGroupResponse, 0, TlvNoResponse),

            /**
             * The ViewGroup command allows a client to request that the server responds with a ViewGroupResponse
             * command containing the name string for a particular group.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.7.2
             */
            viewGroup: Command(1, TlvViewGroupRequest, 1, TlvViewGroupResponse),

            /**
             * The ViewGroupResponse command is sent by the Groups cluster server in response to a ViewGroup command.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.7.8
             */
            viewGroupResponse: Command(1, TlvViewGroupResponse, 1, TlvNoResponse),

            /**
             * The GetGroupMembership command allows a client to inquire about the group membership of the server
             * endpoint, in a number of ways.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.7.3
             */
            getGroupMembership: Command(2, TlvGetGroupMembershipRequest, 2, TlvGetGroupMembershipResponse),

            /**
             * The GetGroupMembershipResponse command is sent by the Groups cluster server in response to a
             * GetGroupMembership command.
             *
             * The fields of the GetGroupMembershipResponse command have the following semantics:
             *
             * The Capacity field shall contain the remaining capacity of the Group Table of the node. The following
             * values apply:
             *
             *   • 0 - No further groups MAY be added.
             *
             *   • 0 < Capacity < 0xfe - Capacity holds the number of groups that MAY be added.
             *
             *   • 0xfe - At least 1 further group MAY be added (exact number is unknown).
             *
             *   • null - It is unknown if any further groups MAY be added.
             *
             * The GroupList field shall contain either the group IDs of all the groups in the Group Table for which
             * the server endpoint is a member of the group (in the case where the GroupList field of the received
             * GetGroupMembership command was empty), or the group IDs of all the groups in the Group Table for which
             * the server endpoint is a member of the group and for which the group ID was included in the the
             * GroupList field of the received GetGroupMembership command (in the case where the GroupList field of the
             * received GetGroupMembership command was not empty).
             *
             * Zigbee: If the total number of groups will cause the maximum payload length of a frame to be exceeded,
             * then the GroupList field shall contain only as many groups as will fit.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.7.9
             */
            getGroupMembershipResponse: Command(2, TlvGetGroupMembershipResponse, 2, TlvNoResponse),

            /**
             * The RemoveGroup command allows a client to request that the server removes the membership for the server
             * endpoint, if any, in a particular group.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.7.4
             */
            removeGroup: Command(3, TlvRemoveGroupRequest, 3, TlvRemoveGroupResponse),

            /**
             * The RemoveGroupResponse command is generated by the server in response to the receipt of a RemoveGroup
             * command.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.7.10
             */
            removeGroupResponse: Command(3, TlvRemoveGroupResponse, 3, TlvNoResponse),

            /**
             * The RemoveAllGroups command allows a client to direct the server to remove all group associations for
             * the server endpoint.
             *
             * The RemoveAllGroups command has no data fields.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.7.5
             */
            removeAllGroups: Command(4, TlvNoArguments, 4, TlvNoResponse),

            /**
             * The AddGroupIfIdentifying command allows a client to add group membership in a particular group for the
             * server endpoint, on condition that the endpoint is identifying itself. Identifying functionality is
             * controlled using the Identify cluster, (see Identify).
             *
             * This command might be used to assist configuring group membership in the absence of a commissioning tool.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.3.7.6
             */
            addGroupIfIdentifying: Command(5, TlvAddGroupIfIdentifyingRequest, 5, TlvNoResponse)
        }
    });

    /**
     * This cluster supports all Groups features.
     */
    export const Complete = Cluster({
        ...Metadata,
        attributes: { ...BaseComponent.attributes },
        commands: { ...BaseComponent.commands }
    });
}
