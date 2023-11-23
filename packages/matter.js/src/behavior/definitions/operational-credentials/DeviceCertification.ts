/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { MatterDevice } from "../../../MatterDevice.js";
import { AttestationCertificateManager } from "../../../certificate/AttestationCertificateManager.js";
import { CertificationDeclarationManager } from "../../../certificate/CertificationDeclarationManager.js";
import { SecureSession } from "../../../session/SecureSession.js";
import { ByteArray } from "../../../util/ByteArray.js";
import { CommissioningOptions } from "../../../node/options/CommissioningOptions.js";
import { Crypto } from "../../../crypto/Crypto.js";
import { PrivateKey } from "../../../crypto/Key.js";

/**
 * Device certification used by the OperationalCredentials cluster.
 */
export class DeviceCertification {
    #privateKey: PrivateKey;
    #certificate: ByteArray;
    #intermediateCertificate: ByteArray;
    #declaration: ByteArray;

    get certificate() {
        return this.#certificate;
    }

    get intermediateCertificate() {
        return this.#intermediateCertificate;
    }

    get declaration() {
        return this.#declaration;
    }

    constructor(
        product: CommissioningOptions.ProductDescription,
        config?: DeviceCertification.Configuration
    ) {
        if (config) {
            this.#privateKey = PrivateKey(config.privateKey);
            this.#certificate = config.certificate;
            this.#intermediateCertificate = config.intermediateCertificate;
            this.#declaration = config.declaration;
        } else {
            const paa = new AttestationCertificateManager(product.vendorId);
            const { keyPair: dacKeyPair, dac } = paa.getDACert(product.productId);

            this.#privateKey = PrivateKey(dacKeyPair.privateKey);
            this.#certificate = dac;
            this.#intermediateCertificate = paa.getPAICert();
            this.#declaration = CertificationDeclarationManager.generate(
                product.vendorId,
                product.productId
            );
        }
    }

    sign(session: SecureSession<MatterDevice>, data: ByteArray) {
        return Crypto.sign(
            this.#privateKey,
            [
                data,
                session.getAttestationChallengeKey(),
            ]
        )
    }
}

export namespace DeviceCertification {
    export interface Configuration {
        privateKey: ByteArray;
        certificate: ByteArray;
        intermediateCertificate: ByteArray;
        declaration: ByteArray;
    }
}
