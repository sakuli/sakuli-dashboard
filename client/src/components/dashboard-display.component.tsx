import React, {useCallback, useState} from 'react';
import ActionButton from "./action-button.component";
import IFrameComponent from "./iframe.component";
import {
    BackendError,
    DashboardActionResponse,
    Display,
    isBackendError,
    isDashboardActionResponse
} from "@sakuli-dashboard/api";
import {reloadUrl} from "../functions/reload-url.function";
import {invokeAction} from "../services/dashboard-backend.service";
import {waitUntilPageIsAvailable} from "../functions/wait-until-page-is-available.function";
import FullscreenButtonComponent from "./fullscreen-button.component";
import {LayoutMode} from "../App";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';
import ErrorMessageBanner from "./error-message-banner.component";

interface DisplayProps {
    display: Display;
    layout: LayoutMode;
    locale: string;
}

const DashboardDisplayComponent: React.FC<DisplayProps> = (props: DisplayProps) => {

    let displayContainerRef: React.RefObject<HTMLDivElement> = React.createRef();

    const [display, setDisplay] = useState(props.display);
    const [isLoading, setIsLoading] = useState(false);
    const [backendError, setBackendError] = useState<BackendError>();

    const handleResponse = useCallback((resp: DashboardActionResponse) => {
        const newUrl = resp.url || reloadUrl(display.url);

        waitUntilPageIsAvailable(newUrl, resp.pollingInterval || 1000)
            .then(() => {
                setDisplay({...display, url: newUrl});
                setIsLoading(false);
            })
    }, [display]);

    const handleOnClick = useCallback(async () => {
        setIsLoading(true);
        const request = {
            actionIdentifier: display.actionIdentifier
        };

        const response = await invokeAction(request);

        if (isDashboardActionResponse(response)) {
            handleResponse(response)
        } else if (isBackendError(response)) {
            setBackendError(response);
            setIsLoading(false);
        }
    }, [display, handleResponse]);

    const infoPopover = () => {
        const infoText = display.messages?.[props.locale]?.infoText;
        if (infoText) {
            return (
                <Tippy content={infoText}>
                    <span><FontAwesomeIcon icon={faInfoCircle}/></span>
                </Tippy>
            );
        }
    };

    const renderDisplay = () => {
        return (
            <div className={"row my-2 justify-content-center"}>
                <IFrameComponent display={display}/>
            </div>
        )
    };

    const renderErrorMessage = (errorMessage: string) => {
        return (
            <div className={"row justify-content-center"}>
                <ErrorMessageBanner errorMessage={errorMessage}/>
            </div>
        )
    };

    const renderDisplayHeader = () => {
        return (
            <div className={"row justify-content-between my-2 mx-auto pb-1 border-bottom border-success"}>
                <div className={"col-5 pl-1 align-self-center"}>
                    <div className={"row"}>
                        <div className={"col-1"}>
                            {infoPopover()}
                        </div>
                        <div className={"col-10"}>
                            {display.messages?.[props.locale]?.description}
                        </div>
                    </div>
                </div>
                <div className={"col-3 text-center"}>
                    {display.actionIdentifier && <ActionButton onClick={handleOnClick} isLoading={isLoading}/>}
                </div>
                <div className={"col-4 pr-1"}>
                    <FullscreenButtonComponent target={displayContainerRef}/>
                </div>
            </div>
        )
    };

    return (
        <div className={props.layout === "row" ? "col-6" : "col-12"} ref={displayContainerRef}>
                {renderDisplayHeader()}
                {backendError ? renderErrorMessage(backendError.message) : renderDisplay()}
        </div>
    )
};
export default DashboardDisplayComponent;