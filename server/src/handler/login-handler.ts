import { AuthenticationConfig } from "../config/authentication.config";
import { generateToken } from "../security/token-generator";

export function handleTokenCreation(authenticationConfig: AuthenticationConfig){
    return (req: any, res: any) => {
        const loginResponse = generateToken(
            authenticationConfig.jwtTokenSecret,
            authenticationConfig.jwtRefreshTokenSecret)
        res.send(loginResponse)
    };
}
