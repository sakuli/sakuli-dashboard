import React, { useCallback, useEffect, useState } from 'react';
import ActionButton from "./action-button.component";
import IFrameComponent from "./iframe.component";
import {
    BackendError,
    DashboardActionResponse,
    Display,
    isBackendError,
    isDashboardActionResponse
} from "@sakuli-dashboard/api";
import { reloadUrl } from "../functions/reload-url.function";
import { invokeAction } from "../services/dashboard-backend.service";
import { waitUntilPageIsAvailable } from "../functions/wait-until-page-is-available.function";
import FullscreenButtonComponent from "./fullscreen-button.component";
import { LayoutMode } from "../App";
import {faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';
import ErrorMessageBanner from "./error-message-banner.component";
import {urlAvailable} from "../functions/url-available.function";
import {sleep} from "../functions/sleep.function";
import placeholder from '../static/placeholder.png';
import Image from "react-bootstrap/Image";

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
    const [pageIsAvailable, setPageIsAvailable] = useState(false);
    const [lastPolling, setLastPolling] = useState(Date.now());
    const pollingInterval = 2000;

    useEffect(() => {
        urlAvailable(display.url)
            .then(isUrlAvailable => setPageIsAvailable(isUrlAvailable))
            .then(() => sleep(pollingInterval))
            .then(() => setLastPolling(Date.now() - pollingInterval));
    }, [lastPolling, display.url]);

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
        }else{
            setBackendError({message: `Could not identify backend response: '${JSON.stringify(response)}'`});
            setIsLoading(false);
        }
    }, [display, handleResponse]);

    const displayPlaceholder = (
        <Image alt="placeholder" src={placeholder} fluid={true}/>
    );

    const renderDisplay = (
        <div className={"row my-2 justify-content-center"}>
            {pageIsAvailable ? <IFrameComponent display={display}/> : displayPlaceholder}
        </div>
    );

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
                    <div className={"row flex-nowrap"}>
                        <div className={"col-1 align-self-center"}>
                            {infoPopover()}
                        </div>
                        <div className={"col-10 align-self-center"}>
                            {display.messages?.[props.locale]?.description}
                        </div>
                    </div>
                </div>
                <div className={"col-2 text-center align-self-center"}>
                    {display.actionIdentifier && <ActionButton onClick={handleOnClick} isLoading={isLoading} pageIsAvailable={pageIsAvailable}/>}
                </div>
                <div className={"col-5 pr-1 align-self-center"}>
                    <FullscreenButtonComponent target={displayContainerRef}/>
                </div>
            </div>
        )
    };

    return (
        <div className={props.layout === "row" ? "col-6 mt-4" : "col-12 mt-4"} ref={displayContainerRef}>
                {renderDisplayHeader()}
                {backendError ? renderErrorMessage(backendError.message) : renderDisplay}
        </div>
    )
};
export default DashboardDisplayComponent;