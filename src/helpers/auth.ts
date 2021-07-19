import { USER_DOES_NOT_EXIST_ERROR, USER_TOKEN_EXPIRED_ERROR } from "../common/errors";
import config from "../config";
import { verify, decode } from "jsonwebtoken";
import walletCreditRequest from "../db/models/walletCreditRequest";

export const authorize = (jwt:string) => {
    const token = verify(jwt, config.APP_SECRET);
    if(!token){
        throw Error(USER_DOES_NOT_EXIST_ERROR);
    }
    const auth:Object = decode(jwt);
    if (auth["exp"] < Date.now()/1000)
        throw Error(USER_TOKEN_EXPIRED_ERROR);
    return auth["sub"];
}

export const extractJwtToken = (authHeader: string) => {
    return authHeader.split(" ")[1].trim();
}

export const ensurePaymentUserAuthorized = async(requestId:String, userId:String, cb: Function) =>{
    const request = await walletCreditRequest.findOne({requestId});
    console.log({
        userId,
        reqUserId: request.userId
    })
    if(request.userId !== userId){
        throw Error("invalid transaction attempt")
    }else{
        try{
        cb();
        }catch(e){
            throw e;
        }
    }
}