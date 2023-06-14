/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { SpecMatter } from "../index.js";
import { ClusterElement, AttributeElement, DatatypeElement, CommandElement } from "../../../index.js";

SpecMatter.children!.push(ClusterElement({
    id: 0x003e, name: "OperationalCredentials",
    classification: "node",
    children: [
        AttributeElement({
            id: 0xfffd, name: "ClusterRevision", base: "uint16",
            access: "R V", conformance: "M", constraint: "min 1", default: 1, quality: "F"
        }),

        AttributeElement({
            id: 0xfffc, name: "FeatureMap", base: "map32",
            access: "R V", conformance: "M", default: 0, quality: "F"
        }),

        AttributeElement({
            id: 0x0000, name: "NoCs", base: "list",
            access: "R F A", conformance: "M", constraint: "max SupportedFabrics", default: "", quality: "N C",
            details: "This attribute contains all NOCs applicable to this Node, encoded as a read-only list of NOCStruct.",
            xref: { document: "core", section: "11.17.5.1", version: "1.1" },
            children: [
                DatatypeElement({
                    name: "entry", base: "NOCStruct"
                })
            ]
        }),

        AttributeElement({
            id: 0x0001, name: "Fabrics", base: "list",
            access: "R F V", conformance: "M", constraint: "max SupportedFabrics", default: "", quality: "N",
            details: "This attribute describes all fabrics to which this Node is commissioned, encoded as a read-only list of FabricDescriptorStruct. This information MAY be computed directly from the NOCs attribute.",
            xref: { document: "core", section: "11.17.5.2", version: "1.1" },
            children: [
                DatatypeElement({
                    name: "entry", base: "FabricDescriptorStruct"
                })
            ]
        }),

        AttributeElement({
            id: 0x0002, name: "SupportedFabrics", base: "uint8",
            access: "R V", conformance: "M", constraint: "5 to 254", default: 0, quality: "F",
            details: "This attribute contains the number of Fabrics that are supported by the device. This value is fixed for a particular device.",
            xref: { document: "core", section: "11.17.5.3", version: "1.1" }
        }),

        AttributeElement({
            id: 0x0003, name: "CommissionedFabrics", base: "uint8",
            access: "R V", conformance: "M", constraint: "max SupportedFabrics", default: 0, quality: "N",
            details: "This attribute contains the number of Fabrics to which the device is currently commissioned. This attribute SHALL be equal to the following:",
            xref: { document: "core", section: "11.17.5.4", version: "1.1" }
        }),

        AttributeElement({
            id: 0x0004, name: "TrustedRootCertificates", base: "list",
            access: "R V", conformance: "M", constraint: "max SupportedFabrics[max 400]", default: "", quality: "N C",
            details: "This attribute SHALL contain a read-only list of Trusted Root CA Certificates installed on the Node, as octet strings containing their Matter Certificate Encoding representation.",
            xref: { document: "core", section: "11.17.5.5", version: "1.1" },
            children: [
                DatatypeElement({
                    name: "entry", base: "octstr"
                })
            ]
        }),

        AttributeElement({
            id: 0x0005, name: "CurrentFabricIndex", base: "uint8",
            access: "R V", conformance: "M", default: 0,
            details: "This attribute SHALL contain accessing fabric index.",
            xref: { document: "core", section: "11.17.5.6", version: "1.1" }
        }),

        CommandElement({
            id: 0x0000, name: "AttestationRequest",
            access: "A", conformance: "M", direction: "request", response: "AttestationResponse",
            details: "This command SHALL be generated to request the Attestation Information, in the form of an AttestationResponse Command. If the AttestationNonce that is provided in the command is malformed, a",
            xref: { document: "core", section: "11.17.6.1", version: "1.1" }
        }),

        CommandElement({
            id: 0x0001, name: "AttestationResponse",
            conformance: "M", direction: "response",
            details: "This command SHALL be generated in response to an Attestation Request command.",
            xref: { document: "core", section: "11.17.6.2", version: "1.1" }
        }),

        CommandElement({
            id: 0x0002, name: "CertificateChainRequest",
            access: "A", conformance: "M", direction: "request", response: "CertificateChainResponse",
            details: "If the CertificateType is not a valid value per CertificateChainTypeEnum then the command SHALL fail with a Status Code of INVALID_COMMAND.",
            xref: { document: "core", section: "11.17.6.3", version: "1.1" }
        }),

        CommandElement({
            id: 0x0003, name: "CertificateChainResponse",
            conformance: "M", direction: "response",
            details: "This command SHALL be generated in response to a CertificateChainRequest command.",
            xref: { document: "core", section: "11.17.6.4", version: "1.1" }
        }),

        CommandElement({
            id: 0x0004, name: "CsrRequest",
            access: "A", conformance: "M", direction: "request", response: "CsrResponse",
            details: "This command SHALL be generated to execute the Node Operational CSR Procedure and subsequently return the NOCSR Information, in the form of a CSRResponse Command.",
            xref: { document: "core", section: "11.17.6.5", version: "1.1" }
        }),

        CommandElement({
            id: 0x0005, name: "CsrResponse",
            conformance: "M", direction: "response",
            details: "This command SHALL be generated in response to a CSRRequest Command.",
            xref: { document: "core", section: "11.17.6.6", version: "1.1" }
        }),

        CommandElement({
            id: 0x0006, name: "AddNoc",
            access: "A", conformance: "M", direction: "request", response: "NocResponse",
            details: "This command SHALL add a new NOC chain to the device and commission a new Fabric association upon successful validation of all arguments and preconditions.",
            xref: { document: "core", section: "11.17.6.8", version: "1.1" }
        }),

        CommandElement({
            id: 0x0007, name: "UpdateNoc",
            access: "F A", conformance: "M", direction: "request", response: "NocResponse",
            details: "This command SHALL replace the NOC and optional associated ICAC (if present) scoped under the accessing fabric upon successful validation of all arguments and preconditions. The new value SHALL immediately be reflected in the NOCs list attribute.",
            xref: { document: "core", section: "11.17.6.9", version: "1.1" }
        }),

        CommandElement({
            id: 0x0008, name: "NocResponse",
            conformance: "M", direction: "response",
            details: "This command SHALL be generated in response to the following commands:",
            xref: { document: "core", section: "11.17.6.10", version: "1.1" }
        }),

        CommandElement({
            id: 0x0009, name: "UpdateFabricLabel",
            access: "F A", conformance: "M", direction: "request", response: "NocResponse",
            details: "This command SHALL be used by an Administrator to set the user-visible Label field for a given Fabric, as reflected by entries in the Fabrics attribute.",
            xref: { document: "core", section: "11.17.6.11", version: "1.1" }
        }),

        CommandElement({
            id: 0x000a, name: "RemoveFabric",
            access: "A", conformance: "M", direction: "request", response: "NocResponse",
            details: "This command is used by Administrators to remove a given Fabric and delete all associated fabric-scoped data.",
            xref: { document: "core", section: "11.17.6.12", version: "1.1" }
        }),

        CommandElement({
            id: 0x000b, name: "AddTrustedRootCertificate",
            access: "A", conformance: "M", direction: "request", response: "status",
            details: "This command SHALL add a Trusted Root CA Certificate, provided as its Matter Certificate Encoding representation, to the TrustedRootCertificates Attribute list and SHALL ensure the next AddNOC command executed uses the provided certificate as its root of trust.",
            xref: { document: "core", section: "11.17.6.13", version: "1.1" }
        }),

        DatatypeElement({
            id: -1, name: "CertificateChainTypeEnum", base: "enum8",
            details: "This data type is derived from enum8.",
            xref: { document: "core", section: "11.17.4.2", version: "1.1" },
            children: [
                DatatypeElement({
                    id: 0x0001, name: "DacCertificate",
                    conformance: "M",
                    xref: { document: "core", section: "11.17.4.2", version: "1.1" }
                }),

                DatatypeElement({
                    id: 0x0002, name: "PaiCertificate",
                    conformance: "M",
                    xref: { document: "core", section: "11.17.4.2", version: "1.1" }
                })
            ]
        })
    ]
}));
