import { IUsersOptions, safeCompare } from "express-basic-auth";
import { verify } from "argon2";

export function getAuthorizer(authenticationConfig: IUsersOptions){
    const users = authenticationConfig.users;
    return async (username: any, password: any, cb: any) => {
        for (const user in users) {
            if(safeCompare(username, user)){
                const passwordHash = users[user];
                return cb(null, await verify(passwordHash, password))
            }
        }

        cb(null,false);
    }
}