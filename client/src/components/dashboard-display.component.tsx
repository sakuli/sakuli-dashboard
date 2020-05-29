import React, {useCallback, useState} from 'react';
import ActionButton from "./action-button.component";
import IFrameComponent from "./iframe.component";
import {
    DashboardActionResponse,
    Display,
    isDashboardActionResponse,
    BackendError,
    isBackendError
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
            <div className={"row"}>
                <IFrameComponent display={display}/>
            </div>
        )
    };

    const renderErrorMessage = (errorMessage: string) => {
        return (
            <div className={"row"}>
                <ErrorMessageBanner errorMessage={errorMessage}/>
            </div>
        )
    };

    return (
        //layout
        <div className={"row mt-5"}>
            <div className={"col-12"}>
                <div className={"row justify-content-between mb-2"}>
                    <div className={"col-5"}>
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
                    <div className={"col-4"}>
                        <FullscreenButtonComponent target={displayContainerRef}/>
                    </div>
                </div>
                {backendError ? renderErrorMessage(backendError.message) : renderDisplay()}
            </div>
        </div>
    )
};
export default DashboardDisplayComponent;