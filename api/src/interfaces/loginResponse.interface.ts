export interface LoginResponse {
    jwtToken: string,
    jwtTokenTTL: number,
    jwtRefreshToken: string
    jwtRefreshTokenTTL: number,
}

export function isLoginResponse(json: any): json is LoginResponse {
    return json &&
        json.length === 4 &&
        typeof json.jwtToken === "string" &&
        typeof json.jwtTokenTTL === "number" &&
        typeof json.jwtRefreshToken === "string" &&
        typeof json.jwtRefreshTokenTTL === "number"
}
