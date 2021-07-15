import { PayloadEncryption } from "./payload-encryption";
import * as forge from "node-forge";

export class DESPayloadEncryptionStrategy implements PayloadEncryption{
    encryptPayload(key: string, payload: string): String {
        var cipher = forge.cipher.createCipher(
         "3DES-ECB",
         forge.util.createBuffer(key)
        );
        cipher.start({ iv: "" });
        cipher.update(forge.util.createBuffer(payload, "utf8"));
        cipher.finish();
        var encrypted = cipher.output;
        return forge.util.encode64(encrypted.getBytes());
    }

}