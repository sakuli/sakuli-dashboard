import React from "react";
import Dashboard from "./dashboard";
import Login from "./Login";
import { LoginResponse } from "@sakuli-dashboard/api";

export interface RouterProps {
    performLogin: (username: string, password: string) => Promise<boolean>;
    loggedIn: boolean
    loginInformation?: LoginResponse
}


const Router: React.FC<RouterProps> = (props: RouterProps) => {
    function performRouting() {
        if(props.loggedIn){
            return <Dashboard loginInformation={props.loginInformation}/>;
        }else{
            return <Login performLogin={props.performLogin}/>
        }
    }

    return performRouting();
}

export default Router;