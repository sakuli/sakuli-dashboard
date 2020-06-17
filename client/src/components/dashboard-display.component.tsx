import React, {useCallback, useEffect, useState} from 'react';
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
import {LayoutMode} from "../App";
import ErrorMessageBanner from "./error-message-banner.component";
import {urlAvailable} from "../functions/url-available.function";
import {sleep} from "../functions/sleep.function";
import placeholder from '../static/placeholder.png';
import Image from "react-bootstrap/Image";
import DashboardDisplayHeaderComponent from "./dashboard-display-header.component";

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

    const renderErrorMessage = (errorMessage: string) => {
        return (
            <div className={"row justify-content-center"}>
                <ErrorMessageBanner errorMessage={errorMessage}/>
            </div>
        )
    };

    return (
        <div className={props.layout === "row" ? "col-6 mt-4" : "col-12 mt-4"} ref={displayContainerRef}>
                <DashboardDisplayHeaderComponent
                    display={display}
                    displayContainerRef={displayContainerRef}
                    locale={props.locale}
                    onClick={handleOnClick}
                    isLoading={isLoading}
                    pageIsAvailable={pageIsAvailable}
                />
                {backendError ? renderErrorMessage(backendError.message) : renderDisplay}
        </div>
    )
};
export default DashboardDisplayComponent;