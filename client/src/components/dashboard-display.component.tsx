import React, { useCallback, useState } from 'react';
import ActionButton from "./action-button.component";
import LoadingScreenComponent from "./loading-screen.component";
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
import styled from "styled-components";
import { LayoutMode } from "../App";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';
import ErrorMessageBanner from "./error-message-banner.component";

interface DisplayProps {
    display: Display;
    layout: LayoutMode;
    locale: string;
}

const DisplayContainer = styled.div<DisplayProps>`
        width: 90%;
        margin: ${(props) => props.layout === "row" ? "1% 1% 0 1%" : "2% auto 2% auto"};
        background: #ffff;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        padding: 0 0 2% 0;
    `;
const FullscreenDiv = styled.div`
        background: #ffff;
    `;

const DisplayHeader = styled.div`
        position: sticky;
        top: 0;
        padding: 10px;
        border-bottom: 1px solid #aadd226b;
        text-align: center;
        font-weight: bold;
        color: #523c3c;
        background: white;
    `;

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

        if(isDashboardActionResponse(response)) {
          handleResponse(response)
        } else if (isBackendError(response)) {
          setBackendError(response);
          setIsLoading(false);
        }else{
            setBackendError({message: `Could not identify backend response: '${JSON.stringify(response)}'`});
            setIsLoading(false);
        }
    }, [display, handleResponse]);

    const InfoIcon = styled.span`
        margin-left: 4px;
    `;

    const infoPopover = () => {
        const infoText = display.messages?.[props.locale]?.infoText;
        if(infoText) {
            return (
                <InfoIcon>
                    <Tippy content={infoText}>
                        <span><FontAwesomeIcon icon={faInfoCircle}/></span>
                    </Tippy>
                </InfoIcon>
            );
        }
    };

    const renderDisplay = () => {
        return (
          <div>
            <IFrameComponent display={display}/>
            {display.actionIdentifier && <ActionButton onClick={handleOnClick}/>}
          </div>
        )
    }

    const renderErrorMessage = (errorMessage: string) => {
        return (
            <ErrorMessageBanner errorMessage={errorMessage} />
        )
    }

    const content = isLoading ? (
        <>
            <DisplayHeader>
                Loading ...
                <FullscreenButtonComponent target={displayContainerRef}/>
            </DisplayHeader>
            <LoadingScreenComponent/>
        </>
    ) : (
        <>
            <DisplayHeader>
                {display.messages?.[props.locale]?.description}
                {infoPopover()}
                <FullscreenButtonComponent target={displayContainerRef}/>
            </DisplayHeader>
          {backendError ? renderErrorMessage(backendError.message) : renderDisplay()}
        </>
    );

    return (
        <DisplayContainer {...props}>
            <FullscreenDiv ref={displayContainerRef}>
                {content}
            </FullscreenDiv>
        </DisplayContainer>
    )
};
export default DashboardDisplayComponent;