import { AuthenticationConfig } from "../config/authenticationConfig";
import { generateToken } from "../security/TokenGenerator";

export function handleTokenCreation(authenticationConfig: AuthenticationConfig){
    return (req: any, res: any) => {
        const loginResponse = generateToken(
            authenticationConfig.jwtTokenSecret,
            authenticationConfig.jwtRefreshTokenSecret)
        res.send(loginResponse)
    };
}
