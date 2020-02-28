import React from 'react';
import {faPlayCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import styled from "styled-components";

interface ActionButtonProps {
    onClick: () => void
}

const ActionButtonComponent: React.FC<ActionButtonProps> = ({onClick}) => {

    const ActionButton = styled.button`
        min-width: 100px;
        border-radius: 5px;
        background: #95c11f;
        font-size: 1rem;
        padding: 0.5rem;
    `;

    return (
        <ActionButton onClick={() => onClick()}>
            <FontAwesomeIcon icon={faPlayCircle}/>
            <span style={{paddingLeft: "0.5rem"}}>Start!</span>
        </ActionButton>
    );
};
export default ActionButtonComponent;