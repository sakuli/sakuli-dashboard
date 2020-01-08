import React from 'react';
import './Dashboard.css';
import button from '../static/button.png';
import { Display } from "../../../server/src/api/dashboard-config-response.interface";


interface ActionButtonProps {
    display: Display
    onClick: () => void
}
const ActionButtonComponent: React.FC<ActionButtonProps> = ({display, onClick}) => {

    function renderButton() {
        if(display.actionIdentifier){
            return <input type={"image"}
                          width={"100px"}
                          alt={"play"}
                          src={button}
                          onClick={() => onClick()}/>;
        }

        return null;
    }

    return renderButton();
};
export default ActionButtonComponent;