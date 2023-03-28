export interface PayloadEncryption{
    encryptPayload(key:String, payload:String): String;
}