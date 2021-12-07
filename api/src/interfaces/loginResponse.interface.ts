export interface LoginResponse {
    jwtToken: string,
    jwtTokenExpiration: number,
    jwtRefreshToken: string
    jwtRefreshTokenExpiration: number,
}

export function isLoginResponse(json: any): json is LoginResponse {
    return json &&
        json.length === 4 &&
        typeof json.jwtToken === "string" &&
        typeof json.jwtTokenExpiration === "number" &&
        typeof json.jwtRefreshToken === "string" &&
        typeof json.jwtRefreshTokenExpiration === "number"
}
