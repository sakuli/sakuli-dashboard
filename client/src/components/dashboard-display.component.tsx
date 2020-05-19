import React, {useCallback, useState} from 'react';
import ActionButton from "./action-button.component";
import LoadingScreenComponent from "./loading-screen.component";
import IFrameComponent from "./iframe.component";
import {DashboardActionResponse, Display, isDashboardActionResponse, BackendError, isBackendError} from "@sakuli-dashboard/api";
import {reloadUrl} from "../functions/reload-url.function";
import {invokeAction} from "../services/dashboard-backend.service";
import {waitUntilPageIsAvailable} from "../functions/wait-until-page-is-available.function";
import FullscreenButtonComponent from "./fullscreen-button.component";
import styled from "styled-components";
import {LayoutMode} from "../App";
import { faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';

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
    const [errorMessage, setErrorMessage] = useState("");

    const handleResponse = useCallback((resp: DashboardActionResponse) => {
        const newUrl = resp.url || reloadUrl(display.url);

        waitUntilPageIsAvailable(newUrl, resp.pollingInterval || 1000)
            .then(() => {
                setDisplay({...display, url: newUrl});
                setIsLoading(false);
            })
    }, [display]);

    const handleError = useCallback((error: BackendError) => {
        setErrorMessage(error.message);
    }, [])

    const handleOnClick = useCallback(async () => {
        setIsLoading(true);
        const request = {
            actionIdentifier: display.actionIdentifier
        };

        const response = await invokeAction(request);

        if(isDashboardActionResponse(response)) {
          handleResponse(response)
        } else if (isBackendError(response)) {
          handleError(response);
        }
    }, [display, handleResponse, handleError]);

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
            <IFrameComponent display={display}/>
            {display.actionIdentifier && <ActionButton onClick={handleOnClick}/>}
        </>
    );

    return (
        <DisplayContainer {...props}>
            <FullscreenDiv ref={displayContainerRef}>
                {content}
            </FullscreenDiv>
            <div>
              {errorMessage}
            </div>
        </DisplayContainer>
    )
};
export default DashboardDisplayComponent;