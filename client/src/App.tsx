import React, { useCallback, useEffect, useState } from 'react';
import { getSecurityConfig, performLogin, refreshLoginInformation } from "./services/dashboard-backend.service";
import { LoginResponse, } from "@sakuli-dashboard/api";
import { useInterval } from 'usehooks-ts'
import { loadLoginInformation, persistLoginInformation } from "./services/localStorageService";
import Router from "./components/Router";

const App: React.FC = () => {

    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [loginInformation, setLoginInformation] = useState<LoginResponse>();

    const refreshToken = useCallback((currentLoginInformation?: LoginResponse) => {(async () => {
        if(currentLoginInformation){
            await performRefresh(currentLoginInformation);
        }
        else{
            setLoggedIn(false)
        }
    })()}, [])

    useEffect(() => {
            (async () => {
                const securityConfigResponse = await getSecurityConfig();
                setLoggedIn(!securityConfigResponse.authorizationEnabled)
                if(securityConfigResponse.authorizationEnabled){
                    await refreshToken(loadLoginInformation());
                }
            })();
        }, [refreshToken]);

    useEffect(() => {
        if(loginInformation){
            persistLoginInformation(loginInformation);
        }
    }, [loginInformation]);

    useInterval(
        () => {(async () => refreshToken(loginInformation))()},
        loginInformation ? loginInformation.jwtTokenTTL * 1000 / 4 : null,
    )

    async function performRefresh (currentLoginInformation: LoginResponse) {
        const refreshedLoginInformation = await refreshLoginInformation(currentLoginInformation.jwtRefreshToken);
        if (refreshedLoginInformation) {
            setLoginInformation(refreshedLoginInformation)
            setLoggedIn(true)
        } else {
            setLoggedIn(false)
        }
    }

    async function loginHandler(user: string, password: string): Promise<boolean> {
        const loginResponse = await performLogin(user, password);
        setLoginInformation(loginResponse);
        setLoggedIn(loginResponse !== undefined)
        return loggedIn
    }

    return <Router
            performLogin={loginHandler}
            loggedIn={loggedIn}
            loginInformation={loginInformation}/>;
};

export default App;
