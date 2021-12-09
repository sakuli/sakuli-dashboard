import { LoginResponse } from "@sakuli-dashboard/api";
import { sign } from "jsonwebtoken";

export function generateToken(tokenSecret: string, refreshTokenSecret: string): LoginResponse{
    const tokenTTL = 300;
    const refreshTokenTTL = 600;

    const token = sign({}, tokenSecret, {expiresIn: tokenTTL})
    const refreshToken = sign({}, refreshTokenSecret, {expiresIn: refreshTokenTTL})

    return {
        jwtToken: token,
        jwtTokenTTL: tokenTTL,
        jwtRefreshToken: refreshToken,
        jwtRefreshTokenTTL: refreshTokenTTL
    }
}