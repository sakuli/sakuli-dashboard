import React from 'react';
import './Dashboard.css';
import { DashboardActionResponse, Display } from "server";
import button from '../static/button.png';
import { invokeAction } from "../services/dashboard-backend.service";
import "./action-button.component.css";


interface ActionButtonProps {
    display: Display
    onClick: () => void
}
const ActionButtonComponent: React.FC<ActionButtonProps> = ({display, onClick}) => {

    function renderButton() {
        if(display.actionIdentifier){
            return <input type={"image"}
                          className="floating-action-button"
                          alt={"play"}
                          src={button}
                          onClick={() => onClick()}/>;
        }

        return null;
    }

    return renderButton();
};
export default ActionButtonComponent;