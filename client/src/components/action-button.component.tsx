import React from 'react';
import {faPlayCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Button from 'react-bootstrap/Button';

interface ActionButtonProps {
    onClick: () => void
    isLoading: boolean
}

const ActionButtonComponent: React.FC<ActionButtonProps> = (props: ActionButtonProps) => {

    const buttonText = props.isLoading ? (
        <>
            <div className={"row"}>
                <div className={"col-1"}>
                    <span className={"spinner-border spinner-border-sm"} role={"status"} aria-hidden={"true"}/>
                </div>
                <div className={"col-8"}>
                    Loading...
                </div>
            </div>
        </>

    ) : (
        <>
            <div className={"row"}>
                <div className={"col-1"}>
                    <FontAwesomeIcon icon={faPlayCircle}/>
                </div>
                <div className={"col-8"}>
                    <span>Start!</span>
                </div>
            </div>
        </>
    );

    return (
        <Button variant={"success"} className={"float-center"} size={"sm"} onClick={() => props.onClick()}>
            {buttonText}
        </Button>
    );
};
export default ActionButtonComponent;