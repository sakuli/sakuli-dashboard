import React from 'react';
import './Dashboard.css';
import button from './static/button.png';
import { invokeAction } from "./dashboard-backend.service";
import { Display } from "../../server/src/api/dashboard-config-response.interface";
import { DashboardActionResponse } from "../../server/src/api/dashboard-action-response.interface";

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