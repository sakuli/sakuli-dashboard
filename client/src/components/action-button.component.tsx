import React from 'react';
import "./action-button.component.css";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ActionButtonProps {
    onClick: () => void
}

const ActionButtonComponent: React.FC<ActionButtonProps> = ({onClick}) => {
    function renderButton() {
        return (
            <button className="action-button" onClick={() => onClick()}>
                <FontAwesomeIcon icon={faPlayCircle}/>Start!
            </button>
        );
    }

    return renderButton();
};
export default ActionButtonComponent;