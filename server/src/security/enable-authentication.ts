import { Express } from "express";
import { AuthenticationConfig } from "../config/authentication.config";
import * as basicAuth from "express-basic-auth";
import { getAuthorizer } from "../middleware/get-authorizer";
import { handleTokenCreation } from "../handler/login-handler";
import jwt from "express-jwt";

export function enableAuthentication(app: Express, authenticationConfig: AuthenticationConfig) {
    app.get('/api/login',
        basicAuth.default({
            authorizer: getAuthorizer(authenticationConfig),
            authorizeAsync: true,
        }),
        handleTokenCreation(authenticationConfig)
    )

    app.get('/api/token/refresh',
        jwt({
            secret: authenticationConfig.jwtRefreshTokenSecret,
            algorithms: ['HS256']
        }),
        handleTokenCreation(authenticationConfig)
    )

    app.use(jwt({
        secret: authenticationConfig.jwtTokenSecret,
        algorithms: ['HS256']
    })
        .unless({path: ['/api/login', '/api/security']}));
}