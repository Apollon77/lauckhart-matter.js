/**
 * @license
 * Copyright 2022-2024 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { ByteArray } from "../util/ByteArray.js";

// from CHIPAttCert_test_vectors.h ...

// PAA without Vendor ID

export const TestCert_PAA_NoVID_PublicKey = ByteArray.fromHex(
    "0410ef02a81a87b68121fba8d31978f807a317e50aa8a828446828914b933de8edd4a5c39c9ff71a4ce3647fd7f62653b7d2495fcba4c0f47f876880039e07204a",
);
export const TestCert_PAA_NoVID_PrivateKey = ByteArray.fromHex(
    "e1f073c934853baffb38bf7e8bdad7a0a674107c7769892a0ff2e06c1a2ef7a7",
);
export const TestCert_PAA_NoVID_SKID = ByteArray.fromHex("785CE705B86B8F4E6FC793AA60CB43EA696882D5");
export const TestCert_PAA_NoVID_Cert = ByteArray.fromHex(
    "3082019130820137a00302010202070b8fbaa8dd86ee300a06082a8648ce3d040302301a3118301606035504030c0f4d61747465722054657374205041413020170d3231303632383134323334335a180f39393939313233313233353935395a301a3118301606035504030c0f4d61747465722054657374205041413059301306072a8648ce3d020106082a8648ce3d0301070342000410ef02a81a87b68121fba8d31978f807a317e50aa8a828446828914b933de8edd4a5c39c9ff71a4ce3647fd7f62653b7d2495fcba4c0f47f876880039e07204aa366306430120603551d130101ff040830060101ff020101300e0603551d0f0101ff040403020106301d0603551d0e04160414785ce705b86b8f4e6fc793aa60cb43ea696882d5301f0603551d23041830168014785ce705b86b8f4e6fc793aa60cb43ea696882d5300a06082a8648ce3d0403020348003045022100b9efdb3ea06a52ec0bf01e61daed2c2d156ddb6cf014101dab798fac05fa47e5022060061d3e35d60d9d4b0d448dad7612f7e85c582e3fc312dc18794dd373715e5d",
);

// PAA with Vendor ID 0xFFF1

export const TestCert_PAA_FFF1_PrivateKey = ByteArray.fromHex(
    "6512caecaecfc543d60623161597162f014684c565a129b62fd28c27ab1ccc50",
);
export const TestCert_PAA_FFF1_PublicKey = ByteArray.fromHex(
    "04b6cb6372887f2928f5bac81aa9d93ae2431cada9d79e242f65177ef9ced932a28ecd03baaf6a8fca184a1a503542960d453f303f1f19421d751e8f8f1a9a9b75",
);
export const TestCert_PAA_FFF1_SKID = ByteArray.fromHex("6AFD22771F511FECBF1641976710DCDC31A1717E");
export const TestCert_PAA_FFF1_Cert = ByteArray.fromHex(
    "308201bd30820164a00302010202084ea8e83182d41c1c300a06082a8648ce3d04030230303118301606035504030c0f4d617474657220546573742050414131143012060a2b0601040182a27c02010c04464646313020170d3231303632383134323334335a180f39393939313233313233353935395a30303118301606035504030c0f4d617474657220546573742050414131143012060a2b0601040182a27c02010c04464646313059301306072a8648ce3d020106082a8648ce3d03010703420004b6cb6372887f2928f5bac81aa9d93ae2431cada9d79e242f65177ef9ced932a28ecd03baaf6a8fca184a1a503542960d453f303f1f19421d751e8f8f1a9a9b75a366306430120603551d130101ff040830060101ff020101300e0603551d0f0101ff040403020106301d0603551d0e041604146afd22771f511fecbf1641976710dcdc31a1717e301f0603551d230418301680146afd22771f511fecbf1641976710dcdc31a1717e300a06082a8648ce3d0403020347003044022050aa8002f4d932a9a00538f65368ad0fffc8efbbc9beb7da569835cf9aa7510e022023bac8fe0f23e75445b65339081a47994929c72aaf0a1548d40d034d514b25de",
);
