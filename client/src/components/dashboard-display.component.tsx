import React, {useCallback, useState} from 'react';
import ActionButton from "./action-button.component";
import LoadingScreenComponent from "./loading-screen.component";
import IFrameComponent from "./iframe.component";
import {DashboardActionResponse, Display, isDashboardActionResponse} from "@sakuli-dashboard/api";
import {reloadUrl} from "../functions/reload-url.function";
import {invokeAction} from "../services/dashboard-backend.service";
import {waitUntilPageIsAvailable} from "../functions/wait-until-page-is-available.function";
import FullscreenButtonComponent from "./fullscreen-button.component";
import styled from "styled-components";
import {LayoutMode} from "../App";
import { useLocale } from "../hooks/use-locale";

interface DisplayProps {
    display: Display;
    layout: LayoutMode;
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
    const locale = useLocale();

    const [display, setDisplay] = useState(props.display);
    const [isLoading, setIsLoading] = useState(false);

    const handleResponse = useCallback((resp: DashboardActionResponse) => {
        const newUrl = resp.url || reloadUrl(display.url);

        waitUntilPageIsAvailable(newUrl, resp.pollingInterval || 1000)
            .then(() => {
                setDisplay({...display, url: newUrl});
                setIsLoading(false);
            })
    }, [display]);

    const handleOnClick = useCallback(() => {
        setIsLoading(true);
        const request = {
            actionIdentifier: display.actionIdentifier
        };
        invokeAction(request)
            .then(json => {
                if (isDashboardActionResponse(json) || {}) {
                    handleResponse(json as DashboardActionResponse);
                }
            })
            .catch(error => console.error(error));
    }, [display, handleResponse]);

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
                {display.messages?.[locale]?.description ?? display.description}
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
        </DisplayContainer>
    )

};
export default DashboardDisplayComponent;