import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    BackendError,
    DashboardActionResponse,
    Display,
    isBackendError,
    isDashboardActionResponse,
    LayoutMode,
    LoginResponse
} from "@sakuli-dashboard/api";
import { urlAvailable } from "../functions/url-available.function";
import { sleep } from "../functions/sleep.function";
import { reloadUrl } from "../functions/reload-url.function";
import { waitUntilPageIsAvailable } from "../functions/wait-until-page-is-available.function";
import { invokeAction } from "../services/dashboard-backend.service";
import DashboardDisplayHeader from "./dashboard-display-header";
import { WebsiteDisplayBody } from "./website-display-body";
import InfoPopover from "./info-popover";
import ActionButton from "./action-button";
import FullscreenButton from "./fullscreen-button";

interface WebsiteDisplayProps {
    display: Display;
    layout: LayoutMode;
    locale: string;
    displayContainerRef: React.RefObject<HTMLDivElement>
    loginInformation?: LoginResponse
}

export const WebsiteDisplay: React.FC<WebsiteDisplayProps> = (props: WebsiteDisplayProps) => {

    const displayHeaderRef: React.RefObject<HTMLDivElement> = useRef(null);
    const [display, setDisplay] = useState(props.display);
    const [isLoading, setIsLoading] = useState(false);
    const [backendError, setBackendError] = useState<BackendError>();
    const [pageIsAvailable, setPageIsAvailable] = useState(false);
    const [lastPolling, setLastPolling] = useState(Date.now());
    const pollingInterval = 2000;

    useEffect(() => {
        urlAvailable(display.url!, props.loginInformation?.jwtToken)
            .then(isUrlAvailable => setPageIsAvailable(isUrlAvailable))
            .then(() => sleep(pollingInterval))
            .then(() => setLastPolling(Date.now() - pollingInterval));
    }, [lastPolling, display.url, props.loginInformation]);

    const handleResponse = useCallback((resp: DashboardActionResponse) => {
        const newUrl = resp.url || reloadUrl(display.url!);

        waitUntilPageIsAvailable(newUrl, resp.pollingInterval || 1000, props.loginInformation?.jwtToken)
            .then(() => {
                setDisplay({...display, url: newUrl});
                setIsLoading(false);
            })
    }, [display, props.loginInformation]);

    const handleOnClick = useCallback(async () => {
        if(display.actionIdentifier){
            setIsLoading(true);
            const request = {
                actionIdentifier: display.actionIdentifier
            };

            const response = await invokeAction(request, props.loginInformation?.jwtToken);

            if (isDashboardActionResponse(response)) {
                handleResponse(response)
            } else if (isBackendError(response)) {
                setBackendError(response);
                setIsLoading(false);
            }else{
                setBackendError({message: `Could not identify backend response: '${JSON.stringify(response)}'`});
                setIsLoading(false);
            }
        }
    }, [display, handleResponse, props.loginInformation]);


    function renderInfoPopover(){
        return <InfoPopover
                messages={props.display.messages}
                displayIndex={props.display.index}
                target={displayHeaderRef}
                locale={props.locale}
            />;
    }

    function renderActionButton(){
        if(props.display.actionIdentifier) {
            return <ActionButton
                onClick={handleOnClick}
                isLoading={isLoading}
                pageIsAvailable={pageIsAvailable}
            />
        }
    }

    return(
        <div>
            <DashboardDisplayHeader
                display={display}
                locale={props.locale}
                displayHeaderRef={displayHeaderRef}
                getLeftElement={renderInfoPopover()}
                getCenterElement={renderActionButton()}
                getRightElement={<FullscreenButton target={props.displayContainerRef}/>}
            />
            <WebsiteDisplayBody
                url={display.url!}
                pageIsAvailable={pageIsAvailable}
                backendError={backendError}/>
        </div>
    )
}