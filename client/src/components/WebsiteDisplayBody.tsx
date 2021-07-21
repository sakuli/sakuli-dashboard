import React from "react";
import { BackendError } from "@sakuli-dashboard/api";
import Image from "react-bootstrap/Image";
import placeholder from "../static/placeholder.png";
import IframeDisplay from "./iframe-display";
import ErrorMessageBanner from "./error-message-banner";

interface DashboardDisplayBodyProps {
    backendError: BackendError | undefined;
    pageIsAvailable: boolean;
    url: string;
}

export const WebsiteDisplayBody: React.FC<DashboardDisplayBodyProps> = (props: DashboardDisplayBodyProps) => {

    const displayPlaceholder = (
        <Image alt="placeholder" src={placeholder} fluid={true}/>
    );

    const renderErrorMessage = (errorMessage: string) => {
        return (
            <div className={"row justify-content-center"}>
                <ErrorMessageBanner errorMessage={errorMessage}/>
            </div>
        )
    };

    const renderDisplay = (
        <div className={"row my-2 justify-content-center"}>
            {props.pageIsAvailable ? <IframeDisplay url={props.url}/> : displayPlaceholder}
        </div>
    );


    return  props.backendError ? renderErrorMessage(props.backendError.message) : renderDisplay
}