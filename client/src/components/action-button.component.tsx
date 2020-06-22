import React from 'react';
import {faPlayCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Button from 'react-bootstrap/Button';

interface ActionButtonProps {
    onClick: () => void
    isLoading: boolean
    pageIsAvailable: boolean
}

const ActionButtonComponent: React.FC<ActionButtonProps> = (props: ActionButtonProps) => {

    const loadingLabel = (
        <>
            <div className={"col-1"}>
                <span className={"spinner-border spinner-border-sm"} role={"status"} aria-hidden={"true"}/>
            </div>
            <div className={"col-8"}>
                Loading...
            </div>
        </>
    );

    const startLabel = (
        <>
            <div className={"col-1"}>
                <FontAwesomeIcon icon={faPlayCircle}/>
            </div>
            <div className={"col-8"}>
                <span>Start!</span>
            </div>
        </>
    );

    return (
        <Button
            variant={"success"}
            className={"float-center"}
            size={"sm"}
            onClick={() => props.onClick()}
            disabled={props.pageIsAvailable}
        >
            <div className={"row flex-nowrap"}>
                {props.isLoading ? loadingLabel : startLabel}
            </div>
        </Button>
    );
};
export default ActionButtonComponent;