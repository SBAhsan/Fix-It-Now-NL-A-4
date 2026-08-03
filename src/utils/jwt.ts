import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import config from "../config";

const createToken = (jwtPayload: JwtPayload, secret: string, expiresIn: SignOptions) => {
    const token = jwt.sign(jwtPayload, secret, {expiresIn} as SignOptions);

    return token;
};


const verifyToken = (token: string, secret: string) => {
    try {
        const verifyToken = jwt.verify(token, secret);

        return {
            success: true,
            data: verifyToken
        }
    } catch (error: any) {
        console.log("Token verification failed", error);

        return {
            success: false,
            error: error.message
        }
    }
};


export const jwtUtils = {
    createToken,
    verifyToken
}