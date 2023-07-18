/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { OptionalAttribute, OptionalWritableAttribute, OptionalCommand, TlvNoResponse } from "../../cluster/Cluster.js";
import { TlvUInt32, TlvInt16, TlvUInt16, TlvInt32, TlvInt8, TlvUInt8 } from "../../tlv/TlvNumber.js";
import { TlvObject, TlvField } from "../../tlv/TlvObject.js";
import { TlvNoArguments } from "../../tlv/TlvNoArguments.js";
import { BuildCluster } from "../../cluster/ClusterBuilder.js";

export const TlvGetProfileInfoResponseCommandRequest = TlvObject({
    profileCount: TlvField(0, TlvUInt8),
    profileIntervalPeriod: TlvField(1, TlvUInt8),
    maxNumberOfIntervals: TlvField(2, TlvUInt8),
    listOfAttributes: TlvField(3, TlvUInt16)
});

export const TlvGetMeasurementProfileResponseCommandRequest = TlvObject({
    startTime: TlvField(0, TlvUInt32),
    status: TlvField(1, TlvUInt8),
    profileIntervalPeriod: TlvField(2, TlvUInt8),
    numberOfIntervalsDelivered: TlvField(3, TlvUInt8),
    attributeId: TlvField(4, TlvUInt16),
    intervals: TlvField(5, TlvUInt8)
});

export const TlvGetMeasurementProfileCommandRequest = TlvObject({
    attributeId: TlvField(0, TlvUInt16),
    startTime: TlvField(1, TlvUInt32),
    numberOfIntervals: TlvField(2, TlvUInt8)
});

export namespace ElectricalMeasurementCluster {
    export const id = 0xb04;
    export const name = "ElectricalMeasurement";
    export const revision = 1;

    const Base = {
        attributes: {
            measurementType: OptionalAttribute(0, TlvUInt32),
            dcVoltage: OptionalAttribute(256, TlvInt16, { default: 32768 }),
            dcVoltageMin: OptionalAttribute(257, TlvInt16, { default: 32768 }),
            dcVoltageMax: OptionalAttribute(258, TlvInt16, { default: 32768 }),
            dcCurrent: OptionalAttribute(259, TlvInt16, { default: 32768 }),
            dcCurrentMin: OptionalAttribute(260, TlvInt16, { default: 32768 }),
            dcCurrentMax: OptionalAttribute(261, TlvInt16, { default: 32768 }),
            dcPower: OptionalAttribute(262, TlvInt16, { default: 32768 }),
            dcPowerMin: OptionalAttribute(263, TlvInt16, { default: 32768 }),
            dcPowerMax: OptionalAttribute(264, TlvInt16, { default: 32768 }),
            dcVoltageMultiplier: OptionalAttribute(512, TlvUInt16, { default: 1 }),
            dcVoltageDivisor: OptionalAttribute(513, TlvUInt16, { default: 1 }),
            dcCurrentMultiplier: OptionalAttribute(514, TlvUInt16, { default: 1 }),
            dcCurrentDivisor: OptionalAttribute(515, TlvUInt16, { default: 1 }),
            dcPowerMultiplier: OptionalAttribute(516, TlvUInt16, { default: 1 }),
            dcPowerDivisor: OptionalAttribute(517, TlvUInt16, { default: 1 }),
            acFrequency: OptionalAttribute(768, TlvUInt16, { default: 65535 }),
            acFrequencyMin: OptionalAttribute(769, TlvUInt16, { default: 65535 }),
            acFrequencyMax: OptionalAttribute(770, TlvUInt16, { default: 65535 }),
            neutralCurrent: OptionalAttribute(771, TlvUInt16),
            totalActivePower: OptionalAttribute(772, TlvInt32),
            totalReactivePower: OptionalAttribute(773, TlvInt32),
            totalApparentPower: OptionalAttribute(774, TlvUInt32, { default: 1 }),
            measured1StHarmonicCurrent: OptionalAttribute(775, TlvInt16, { default: 32768 }),
            measured3RdHarmonicCurrent: OptionalAttribute(776, TlvInt16, { default: 32768 }),
            measured5ThHarmonicCurrent: OptionalAttribute(777, TlvInt16, { default: 32768 }),
            measured7ThHarmonicCurrent: OptionalAttribute(778, TlvInt16, { default: 32768 }),
            measured9ThHarmonicCurrent: OptionalAttribute(779, TlvInt16, { default: 32768 }),
            measured11ThHarmonicCurrent: OptionalAttribute(780, TlvInt16, { default: 32768 }),
            measuredPhase1StHarmonicCurrent: OptionalAttribute(781, TlvInt16, { default: 32768 }),
            measuredPhase3RdHarmonicCurrent: OptionalAttribute(782, TlvInt16, { default: 32768 }),
            measuredPhase5ThHarmonicCurrent: OptionalAttribute(783, TlvInt16, { default: 32768 }),
            measuredPhase7ThHarmonicCurrent: OptionalAttribute(784, TlvInt16, { default: 32768 }),
            measuredPhase9ThHarmonicCurrent: OptionalAttribute(785, TlvInt16, { default: 32768 }),
            measuredPhase11ThHarmonicCurrent: OptionalAttribute(786, TlvInt16, { default: 32768 }),
            acFrequencyMultiplier: OptionalAttribute(1024, TlvUInt16, { default: 1 }),
            acFrequencyDivisor: OptionalAttribute(1025, TlvUInt16, { default: 1 }),
            powerMultiplier: OptionalAttribute(1026, TlvUInt32, { default: 1 }),
            powerDivisor: OptionalAttribute(1027, TlvUInt32, { default: 1 }),
            harmonicCurrentMultiplier: OptionalAttribute(1028, TlvInt8),
            phaseHarmonicCurrentMultiplier: OptionalAttribute(1029, TlvInt8),
            instantaneousVoltage: OptionalAttribute(1280, TlvInt16, { default: 65535 }),
            instantaneousLineCurrent: OptionalAttribute(1281, TlvUInt16, { default: 65535 }),
            instantaneousActiveCurrent: OptionalAttribute(1282, TlvInt16, { default: 65535 }),
            instantaneousReactiveCurrent: OptionalAttribute(1283, TlvInt16, { default: 65535 }),
            instantaneousPower: OptionalAttribute(1284, TlvInt16, { default: 65535 }),
            rmsVoltage: OptionalAttribute(1285, TlvUInt16, { default: 65535 }),
            rmsVoltageMin: OptionalAttribute(1286, TlvUInt16, { default: 32768 }),
            rmsVoltageMax: OptionalAttribute(1287, TlvUInt16, { default: 32768 }),
            rmsCurrent: OptionalAttribute(1288, TlvUInt16, { default: 65535 }),
            rmsCurrentMin: OptionalAttribute(1289, TlvUInt16, { default: 65535 }),
            rmsCurrentMax: OptionalAttribute(1290, TlvUInt16, { default: 65535 }),
            activePower: OptionalAttribute(1291, TlvInt16, { default: 65535 }),
            activePowerMin: OptionalAttribute(1292, TlvInt16, { default: 65535 }),
            activePowerMax: OptionalAttribute(1293, TlvInt16, { default: 65535 }),
            reactivePower: OptionalAttribute(1294, TlvInt16, { default: 65535 }),
            apparentPower: OptionalAttribute(1295, TlvUInt16, { default: 65535 }),
            acPowerFactor: OptionalAttribute(1296, TlvInt8),
            averageRmsVoltageMeasurementPeriod: OptionalWritableAttribute(1297, TlvUInt16),
            averageRmsUnderVoltageCounter: OptionalWritableAttribute(1299, TlvUInt16),
            rmsExtremeOverVoltagePeriod: OptionalWritableAttribute(1300, TlvUInt16),
            rmsExtremeUnderVoltagePeriod: OptionalWritableAttribute(1301, TlvUInt16),
            rmsVoltageSagPeriod: OptionalWritableAttribute(1302, TlvUInt16),
            rmsVoltageSwellPeriod: OptionalWritableAttribute(1303, TlvUInt16),
            acVoltageMultiplier: OptionalAttribute(1536, TlvUInt16, { default: 1 }),
            acVoltageDivisor: OptionalAttribute(1537, TlvUInt16, { default: 1 }),
            acCurrentMultiplier: OptionalAttribute(1538, TlvUInt16, { default: 1 }),
            acCurrentDivisor: OptionalAttribute(1539, TlvUInt16, { default: 1 }),
            acPowerMultiplier: OptionalAttribute(1540, TlvUInt16, { default: 1 }),
            acPowerDivisor: OptionalAttribute(1541, TlvUInt16, { default: 1 }),
            dcOverloadAlarmsMask: OptionalWritableAttribute(1792, TlvUInt8),
            dcVoltageOverload: OptionalAttribute(1793, TlvInt16, { default: 65535 }),
            dcCurrentOverload: OptionalAttribute(1794, TlvInt16, { default: 65535 }),
            acOverloadAlarmsMask: OptionalWritableAttribute(2048, TlvUInt16),
            acVoltageOverload: OptionalAttribute(2049, TlvInt16, { default: 65535 }),
            acCurrentOverload: OptionalAttribute(2050, TlvInt16, { default: 65535 }),
            acPowerOverload: OptionalAttribute(2051, TlvInt16, { default: 65535 }),
            acReactivePowerOverload: OptionalAttribute(2052, TlvInt16, { default: 65535 }),
            averageRmsOverVoltage: OptionalAttribute(2053, TlvInt16, { default: 65535 }),
            averageRmsUnderVoltage: OptionalAttribute(2054, TlvInt16, { default: 65535 }),
            rmsExtremeOverVoltage: OptionalAttribute(2055, TlvInt16, { default: 65535 }),
            rmsExtremeUnderVoltage: OptionalAttribute(2056, TlvInt16, { default: 65535 }),
            rmsVoltageSag: OptionalAttribute(2057, TlvInt16, { default: 65535 }),
            rmsVoltageSwell: OptionalAttribute(2058, TlvInt16, { default: 65535 }),
            lineCurrentPhaseB: OptionalAttribute(2305, TlvUInt16, { default: 65535 }),
            activeCurrentPhaseB: OptionalAttribute(2306, TlvInt16, { default: 65535 }),
            reactiveCurrentPhaseB: OptionalAttribute(2307, TlvInt16, { default: 65535 }),
            rmsVoltagePhaseB: OptionalAttribute(2309, TlvUInt16, { default: 65535 }),
            rmsVoltageMinPhaseB: OptionalAttribute(2310, TlvUInt16, { default: 65535 }),
            rmsVoltageMaxPhaseB: OptionalAttribute(2311, TlvUInt16, { default: 65535 }),
            rmsCurrentPhaseB: OptionalAttribute(2312, TlvUInt16, { default: 65535 }),
            rmsCurrentMinPhaseB: OptionalAttribute(2313, TlvUInt16, { default: 65535 }),
            rmsCurrentMaxPhaseB: OptionalAttribute(2314, TlvUInt16, { default: 65535 }),
            activePowerPhaseB: OptionalAttribute(2315, TlvInt16, { default: 65535 }),
            activePowerMinPhaseB: OptionalAttribute(2316, TlvInt16, { default: 65535 }),
            activePowerMaxPhaseB: OptionalAttribute(2317, TlvInt16, { default: 65535 }),
            reactivePowerPhaseB: OptionalAttribute(2318, TlvInt16, { default: 65535 }),
            apparentPowerPhaseB: OptionalAttribute(2319, TlvUInt16, { default: 65535 }),
            powerFactorPhaseB: OptionalAttribute(2320, TlvInt8),
            averageRmsVoltageMeasurementPeriodPhaseB: OptionalAttribute(2321, TlvUInt16),
            averageRmsOverVoltageCounterPhaseB: OptionalAttribute(2322, TlvUInt16),
            averageRmsUnderVoltageCounterPhaseB: OptionalAttribute(2323, TlvUInt16),
            rmsExtremeOverVoltagePeriodPhaseB: OptionalAttribute(2324, TlvUInt16),
            rmsExtremeUnderVoltagePeriodPhaseB: OptionalAttribute(2325, TlvUInt16),
            rmsVoltageSagPeriodPhaseB: OptionalAttribute(2326, TlvUInt16),
            rmsVoltageSwellPeriodPhaseB: OptionalAttribute(2327, TlvUInt16),
            lineCurrentPhaseC: OptionalAttribute(2561, TlvUInt16, { default: 65535 }),
            activeCurrentPhaseC: OptionalAttribute(2562, TlvInt16, { default: 65535 }),
            reactiveCurrentPhaseC: OptionalAttribute(2563, TlvInt16, { default: 65535 }),
            rmsVoltagePhaseC: OptionalAttribute(2565, TlvUInt16, { default: 65535 }),
            rmsVoltageMinPhaseC: OptionalAttribute(2566, TlvUInt16, { default: 65535 }),
            rmsVoltageMaxPhaseC: OptionalAttribute(2567, TlvUInt16, { default: 65535 }),
            rmsCurrentPhaseC: OptionalAttribute(2568, TlvUInt16, { default: 65535 }),
            rmsCurrentMinPhaseC: OptionalAttribute(2569, TlvUInt16, { default: 65535 }),
            rmsCurrentMaxPhaseC: OptionalAttribute(2570, TlvUInt16, { default: 65535 }),
            activePowerPhaseC: OptionalAttribute(2571, TlvInt16, { default: 65535 }),
            activePowerMinPhaseC: OptionalAttribute(2572, TlvInt16, { default: 65535 }),
            activePowerMaxPhaseC: OptionalAttribute(2573, TlvInt16, { default: 65535 }),
            reactivePowerPhaseC: OptionalAttribute(2574, TlvInt16, { default: 65535 }),
            apparentPowerPhaseC: OptionalAttribute(2575, TlvUInt16, { default: 65535 }),
            powerFactorPhaseC: OptionalAttribute(2576, TlvInt8),
            averageRmsVoltageMeasurementPeriodPhaseC: OptionalAttribute(2577, TlvUInt16),
            averageRmsOverVoltageCounterPhaseC: OptionalAttribute(2578, TlvUInt16),
            averageRmsUnderVoltageCounterPhaseC: OptionalAttribute(2579, TlvUInt16),
            rmsExtremeOverVoltagePeriodPhaseC: OptionalAttribute(2580, TlvUInt16),
            rmsExtremeUnderVoltagePeriodPhaseC: OptionalAttribute(2581, TlvUInt16),
            rmsVoltageSagPeriodPhaseC: OptionalAttribute(2582, TlvUInt16),
            rmsVoltageSwellPeriodPhaseC: OptionalAttribute(2583, TlvUInt16)
        },

        commands: {
            getProfileInfoResponseCommand: OptionalCommand(0, TlvGetProfileInfoResponseCommandRequest, 0, TlvNoResponse),
            getProfileInfoCommand: OptionalCommand(0, TlvNoArguments, 0, TlvNoResponse),

            getMeasurementProfileResponseCommand: OptionalCommand(
                1,
                TlvGetMeasurementProfileResponseCommandRequest,
                1,
                TlvNoResponse
            ),

            getMeasurementProfileCommand: OptionalCommand(1, TlvGetMeasurementProfileCommandRequest, 1, TlvNoResponse)
        }
    };

    export const Complete = BuildCluster({ id, name, revision, elements: [ Base ] });
};