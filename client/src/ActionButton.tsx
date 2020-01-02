import React from 'react';
import './Dashboard.css';
import button from './static/button.png';
import { invokeAction } from "./DashboardBackendService";

interface ActionButtonProps {
    actionIdentifier: string
}
const ActionButton: React.FC<ActionButtonProps> = ({actionIdentifier}) => {

    function handleButtonClick(actionIdentifier: string) {
        const request = {
            actionIdentifier: actionIdentifier
        };
        invokeAction(request)
            .then(json => console.log(`"Invoked action ${json.actionIdentifier}."`))
            .catch(error => console.error(error));
    }

    function renderButton() {
        if(actionIdentifier){
            return <input type={"image"}
                          width={"100px"}
                          alt={"play"}
                          src={button}
                          onClick={() => handleButtonClick(actionIdentifier)}/>;
        }

        return null;
    }

    return renderButton();
};
export default ActionButton;