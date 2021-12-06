export interface AuthenticationConfig {
    users: { [username: string]: string },
    jwtTokenSecret: string
    jwtRefreshTokenSecret: string
}

export function isAuthenticationConfig(json: any): json is AuthenticationConfig {
    if (!json) {
        return false;
    }

    return Object.keys(json).length === 3 &&
        validateUserObject(json.users) &&
        typeof json.jwtTokenSecret === "string" &&
        typeof json.jwtRefreshTokenSecret === "string";
}

function validateUserObject(json: any): boolean{
    if(typeof json === "object"){
        for (const user in json) {
            if( typeof json[user] !== "string"){
                return false;
            }
        }
        return true
    }

    return false;
}