import React from 'react';
import './Dashboard.css';
import { DashboardActionResponse, Display } from "server";
import button from '../static/button.png';
import { invokeAction } from "../services/dashboard-backend.service";


interface ActionButtonProps {
    display: Display
    onResponse: (resp: DashboardActionResponse) => void
}
const ActionButtonComponent: React.FC<ActionButtonProps> = ({display, onResponse}) => {

    function handleButtonClick(actionIdentifier: string) {
        const request = {
            actionIdentifier: actionIdentifier
        };
        invokeAction(request)
            .then(json => onResponse(json))
            .catch(error => console.error(error));
    }

    function renderButton() {
        if(display.actionIdentifier){
            return <input type={"image"}
                          width={"100px"}
                          alt={"play"}
                          src={button}
                          onClick={() => handleButtonClick(display.actionIdentifier)}/>;
        }

        return null;
    }

    return renderButton();
};
export default ActionButtonComponent;