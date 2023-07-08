/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { MatterApplicationClusterSpecificationV1_1 } from "../../spec/Specifications.js";
import { BitFlags, TypeFromPartialBitSchema, BitFlag } from "../../schema/BitmapSchema.js";
import { extendCluster, preventCluster, ClusterMetadata, ClusterComponent } from "../../cluster/ClusterFactory.js";
import { FixedAttribute, Attribute, Event, EventPriority, Cluster } from "../../cluster/Cluster.js";
import { TlvUInt8 } from "../../tlv/TlvNumber.js";
import { TlvObject, TlvField } from "../../tlv/TlvObject.js";

/**
 * Switch
 *
 * This cluster exposes interactions with a switch device, for the purpose of using those interactions by other
 * devices. Two types of switch devices are supported: latching switch (e.g. rocker switch) and momentary switch (e.g.
 * push button), distinguished with their feature flags. Interactions with the switch device are exposed as attributes
 * (for the latching switch) and as events (for both types of switches). An interested party MAY subscribe to these
 * attributes/events and thus be informed of the interactions, and can perform actions based on this, for example by
 * sending commands to perform an action such as controlling a light or a window shade.
 *
 * Use this factory function to create a Switch cluster supporting a specific set of features.  Include each
 * {@link SwitchCluster.Feature} you wish to support.
 *
 * @param features a list of {@link SwitchCluster.Feature} to support
 * @returns a Switch cluster with specified features enabled
 * @throws {IllegalClusterError} if the feature combination is disallowed by the Matter specification
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.11
 */
export function SwitchCluster<T extends SwitchCluster.Feature[]>(...features: [ ...T ]) {
    const cluster = {
        ...SwitchCluster.Metadata,
        supportedFeatures: BitFlags(SwitchCluster.Metadata.features, ...features),
        ...SwitchCluster.BaseComponent
    };
    extendCluster(cluster, SwitchCluster.MomentarySwitchMultiPressComponent, { momentarySwitchMultiPress: true });
    extendCluster(cluster, SwitchCluster.LatchingSwitchComponent, { latchingSwitch: true });
    extendCluster(cluster, SwitchCluster.MomentarySwitchComponent, { momentarySwitch: true });
    extendCluster(cluster, SwitchCluster.MomentarySwitchLongPressComponent, { momentarySwitchLongPress: true });
    extendCluster(cluster, SwitchCluster.MomentarySwitchReleaseComponent, { momentarySwitchRelease: true });

    preventCluster(
        cluster,
        { momentarySwitchRelease: true, momentarySwitch: false },
        { momentarySwitchLongPress: true, momentarySwitch: false },
        { momentarySwitchLongPress: true, momentarySwitchRelease: false },
        { momentarySwitchMultiPress: true, momentarySwitch: false },
        { momentarySwitchMultiPress: true, momentarySwitchRelease: false },
        { latchingSwitch: true, momentarySwitch: false },
        { latchingSwitch: false, momentarySwitch: true }
    );

    return cluster as unknown as SwitchCluster.Type<BitFlags<typeof SwitchCluster.Metadata.features, T>>;
};

/**
 * This event SHALL be generated to indicate how many times the momentary switch has been pressed in a multi-press
 * sequence, during that sequence. See Section 1.11.9, “Sequence of events for MultiPress” below.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.11.7.6
 */
export const TlvMultiPressOngoingEvent = TlvObject({
    newPosition: TlvField(0, TlvUInt8),
    currentNumberOfPressesCounted: TlvField(1, TlvUInt8.bound({ min: 2 }))
});

/**
 * This event SHALL be generated to indicate how many times the momentary switch has been pressed in a multi-press
 * sequence, after it has been detected that the sequence has ended. See Section 1.11.9, “Sequence of events for
 * MultiPress” below.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.11.7.7
 */
export const TlvMultiPressCompleteEvent = TlvObject({
    previousPosition: TlvField(0, TlvUInt8),
    totalNumberOfPressesCounted: TlvField(1, TlvUInt8.bound({ min: 1 }))
});

/**
 * This event SHALL be generated, when the latching switch is moved to a new position. It MAY have been delayed by
 * debouncing within the switch.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.11.7.1
 */
export const TlvSwitchLatchedEvent = TlvObject({ newPosition: TlvField(0, TlvUInt8) });

/**
 * This event SHALL be generated, when the momentary switch starts to be pressed (after debouncing).
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.11.7.2
 */
export const TlvInitialPressEvent = TlvObject({ newPosition: TlvField(0, TlvUInt8) });

/**
 * This event SHALL be generated, when the momentary switch has been pressed for a "long" time (this time interval is
 * manufacturer determined (e.g. since it depends on the switch physics)).
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.11.7.3
 */
export const TlvLongPressEvent = TlvObject({ newPosition: TlvField(0, TlvUInt8) });

/**
 * This event SHALL be generated, when the momentary switch has been released (after debouncing) and after having been
 * pressed for a long time, i.e. this event SHALL be generated when the switch is released if a LongPress event has
 * been generated since since the previous InitialPress event. Also see Section 1.11.8, “Sequence of generated events”.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.11.7.5
 */
export const TlvLongReleaseEvent = TlvObject({ previousPosition: TlvField(0, TlvUInt8) });

/**
 * This event SHALL be generated, when the momentary switch has been released (after debouncing).
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.11.7.4
 */
export const TlvShortReleaseEvent = TlvObject({ previousPosition: TlvField(0, TlvUInt8) });

export namespace SwitchCluster {
    /**
     * These are optional features supported by SwitchCluster.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.11.4
     */
    export enum Feature {
        /**
         * LatchingSwitch
         */
        LatchingSwitch = "LatchingSwitch",

        /**
         * MomentarySwitch
         */
        MomentarySwitch = "MomentarySwitch",

        /**
         * MomentarySwitchRelease
         */
        MomentarySwitchRelease = "MomentarySwitchRelease",

        /**
         * MomentarySwitchLongPress
         */
        MomentarySwitchLongPress = "MomentarySwitchLongPress",

        /**
         * MomentarySwitchMultiPress
         */
        MomentarySwitchMultiPress = "MomentarySwitchMultiPress"
    };

    export type Type<T extends TypeFromPartialBitSchema<typeof Metadata.features>> = 
        typeof Metadata
        & { supportedFeatures: T }
        & typeof BaseComponent
        & (T extends { momentarySwitchMultiPress: true } ? typeof MomentarySwitchMultiPressComponent : {})
        & (T extends { latchingSwitch: true } ? typeof LatchingSwitchComponent : {})
        & (T extends { momentarySwitch: true } ? typeof MomentarySwitchComponent : {})
        & (T extends { momentarySwitchLongPress: true } ? typeof MomentarySwitchLongPressComponent : {})
        & (T extends { momentarySwitchRelease: true } ? typeof MomentarySwitchReleaseComponent : {})
        & (T extends { momentarySwitchRelease: true, momentarySwitch: false } ? never : {})
        & (T extends { momentarySwitchLongPress: true, momentarySwitch: false } ? never : {})
        & (T extends { momentarySwitchLongPress: true, momentarySwitchRelease: false } ? never : {})
        & (T extends { momentarySwitchMultiPress: true, momentarySwitch: false } ? never : {})
        & (T extends { momentarySwitchMultiPress: true, momentarySwitchRelease: false } ? never : {})
        & (T extends { latchingSwitch: true, momentarySwitch: false } ? never : {})
        & (T extends { latchingSwitch: false, momentarySwitch: true } ? never : {});

    /**
     * Switch cluster metadata.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.11
     */
    export const Metadata = ClusterMetadata({
        id: 0x3b,
        name: "Switch",
        revision: 1,

        features: {
            /**
             * LatchingSwitch
             */
            latchingSwitch: BitFlag(0),

            /**
             * MomentarySwitch
             */
            momentarySwitch: BitFlag(1),

            /**
             * MomentarySwitchRelease
             */
            momentarySwitchRelease: BitFlag(2),

            /**
             * MomentarySwitchLongPress
             */
            momentarySwitchLongPress: BitFlag(3),

            /**
             * MomentarySwitchMultiPress
             */
            momentarySwitchMultiPress: BitFlag(4)
        }
    });

    /**
     * A SwitchCluster supports these elements for all feature combinations.
     */
    export const BaseComponent = ClusterComponent({
        attributes: {
            /**
             * This attribute SHALL indicate the maximum number of positions the switch has. Any kind of switch has a
             * minimum of 2 positions. Also see Section 1.11.10, “NumberOfPositions > 2” for the case
             * NumberOfPositions>2.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.11.5.1
             */
            numberOfPositions: FixedAttribute(0, TlvUInt8.bound({ min: 2 }), { default: 2 }),

            /**
             * This attribute SHALL indicate the position of the switch. The valid range is zero to
             * NumberOfPositions-1. CurrentPosition value 0 SHALL be assigned to the default position of the switch:
             * for example the "open" state of a rocker switch, or the "idle" state of a push button switch.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.11.5.2
             */
            currentPosition: Attribute(1, TlvUInt8, { persistent: true })
        }
    });

    /**
     * A SwitchCluster supports these elements if it supports feature MomentarySwitchMultiPress.
     */
    export const MomentarySwitchMultiPressComponent = ClusterComponent({
        attributes: {
            /**
             * This attribute SHALL indicate how many consecutive presses can be detected and reported by a momentary
             * switch which supports multi-press (e.g. it will report the value 3 if it can detect single press, double
             * press and triple press, but not quad press and beyond).
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.11.5.3
             */
            multiPressMax: FixedAttribute(2, TlvUInt8.bound({ min: 2 }), { default: 2 })
        },

        events: {
            /**
             * This event SHALL be generated to indicate how many times the momentary switch has been pressed in a
             * multi-press sequence, during that sequence. See Section 1.11.9, “Sequence of events for MultiPress”
             * below.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.11.7.6
             */
            multiPressOngoing: Event(5, EventPriority.Info, TlvMultiPressOngoingEvent),

            /**
             * This event SHALL be generated to indicate how many times the momentary switch has been pressed in a
             * multi-press sequence, after it has been detected that the sequence has ended. See Section 1.11.9,
             * “Sequence of events for MultiPress” below.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.11.7.7
             */
            multiPressComplete: Event(6, EventPriority.Info, TlvMultiPressCompleteEvent)
        }
    });

    /**
     * A SwitchCluster supports these elements if it supports feature LatchingSwitch.
     */
    export const LatchingSwitchComponent = ClusterComponent({
        events: {
            /**
             * This event SHALL be generated, when the latching switch is moved to a new position. It MAY have been
             * delayed by debouncing within the switch.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.11.7.1
             */
            switchLatched: Event(0, EventPriority.Info, TlvSwitchLatchedEvent)
        }
    });

    /**
     * A SwitchCluster supports these elements if it supports feature MomentarySwitch.
     */
    export const MomentarySwitchComponent = ClusterComponent({
        events: {
            /**
             * This event SHALL be generated, when the momentary switch starts to be pressed (after debouncing).
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.11.7.2
             */
            initialPress: Event(1, EventPriority.Info, TlvInitialPressEvent)
        }
    });

    /**
     * A SwitchCluster supports these elements if it supports feature MomentarySwitchLongPress.
     */
    export const MomentarySwitchLongPressComponent = ClusterComponent({
        events: {
            /**
             * This event SHALL be generated, when the momentary switch has been pressed for a "long" time (this time
             * interval is manufacturer determined (e.g. since it depends on the switch physics)).
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.11.7.3
             */
            longPress: Event(2, EventPriority.Info, TlvLongPressEvent),

            /**
             * This event SHALL be generated, when the momentary switch has been released (after debouncing) and after
             * having been pressed for a long time, i.e. this event SHALL be generated when the switch is released if a
             * LongPress event has been generated since since the previous InitialPress event. Also see Section 1.11.8,
             * “Sequence of generated events”.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.11.7.5
             */
            longRelease: Event(4, EventPriority.Info, TlvLongReleaseEvent)
        }
    });

    /**
     * A SwitchCluster supports these elements if it supports feature MomentarySwitchRelease.
     */
    export const MomentarySwitchReleaseComponent = ClusterComponent({
        events: {
            /**
             * This event SHALL be generated, when the momentary switch has been released (after debouncing).
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.11.7.4
             */
            shortRelease: Event(3, EventPriority.Info, TlvShortReleaseEvent)
        }
    });

    /**
     * This cluster supports all Switch features.  It may support illegal feature combinations.
     *
     * If you use this cluster you must manually specify which features are active and ensure the set of active
     * features is legal per the Matter specification.
     */
    export const Complete = Cluster({
        ...Metadata,
        attributes: { ...BaseComponent.attributes, ...MomentarySwitchMultiPressComponent.attributes },

        events: {
            ...MomentarySwitchMultiPressComponent.events,
            ...LatchingSwitchComponent.events,
            ...MomentarySwitchComponent.events,
            ...MomentarySwitchLongPressComponent.events,
            ...MomentarySwitchReleaseComponent.events
        }
    });
};
