import React, { useEffect, useState } from 'react';
import Dashboard from "./components/dashboard";
import { getSecurityConfig, performLogin, refreshLoginInformation } from "./services/dashboard-backend.service";
import { LoginResponse, SecurityConfigResponse, } from "@sakuli-dashboard/api";
import Login from "./components/Login";
import { useInterval } from 'usehooks-ts'

const App: React.FC = () => {

    const [securityConfiguration, setSecurityConfiguration] = useState<SecurityConfigResponse>();
    const [loginInformation, setLoginInformation] = useState<LoginResponse>();

    useEffect(() => {
            (async () => {
                setSecurityConfiguration(await getSecurityConfig())
            })();
        }, []);

    useInterval(
        () => {
           refreshLoginInformation(loginInformation!.jwtRefreshToken)
               .then(loginResponse => setLoginInformation(loginResponse))
        },
        loginInformation ? loginInformation.jwtTokenTTL * 1000 / 4 : null,
    )

    async function loginHandler(user: string, password: string): Promise<boolean> {
        setLoginInformation(await performLogin(user, password))
        return loginInformation !== undefined
    }

    let loggedIn = function () {
        return securityConfiguration?.authorizationEnabled !== true || loginInformation !== undefined;
    };

    function renderApp() {
        if(loggedIn()){
            return <Dashboard loginInformation={loginInformation}/>;
        }else{
            return <Login performLogin={loginHandler}/>
        }
    }

    return renderApp();
};

export default App;
