import React, { useState } from 'react';
import ActionButton from "./action-button.component";
import LoadingScreenComponent from "./loading-screen.component";
import IFrameComponent from "./iframe.component";
import { DashboardActionResponse, Display, isDashboardActionResponse } from "@sakuli-dashboard/api";
import { reloadUrl } from "../functions/reload-url.function";
import { invokeAction } from "../services/dashboard-backend.service";
import { waitUntilPageIsAvailable } from "../functions/wait-until-page-is-available.function";
import FullscreenButtonComponent from "./fullscreen-button.component";
import styled from "styled-components";

interface DisplayProps {
    display: Display
}
const DashboardDisplayComponent: React.FC<DisplayProps> = (props: DisplayProps) => {

    let displayContainerRef: React.RefObject<HTMLDivElement> = React.createRef();

    const [display, setDisplay] = useState(props.display);
    const [isLoading, setIsLoading] = useState(false);

    function handleOnClick(){
        setIsLoading(true);
        const request = {
            actionIdentifier: display.actionIdentifier
        };
        invokeAction(request)
            .then(json => {
                if(isDashboardActionResponse(json) || {}) {
                    handleResponse(json as DashboardActionResponse);
                }
            })
            .catch(error => console.error(error));
    }

    function handleResponse(resp: DashboardActionResponse){
        const newUrl = resp.url || reloadUrl(display.url);

        waitUntilPageIsAvailable(newUrl, resp.pollingInterval || 1000)
            .then(() => {
                setDisplay({...display, url: newUrl});
                setIsLoading(false);
            })
    }

    const DisplayContainer = styled.div`
        width: 90%;
        margin: 2% auto 2% auto;
        background: #ffff;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        padding: 0 0 2% 0;

        @media all and (min-width: 1200px) {
                margin: 1% 1% 0 1%;
        }
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

    if (isLoading) {
        return(
            <DisplayContainer ref={displayContainerRef}>
                <DisplayHeader>Loading ...</DisplayHeader>
                <LoadingScreenComponent/>
            </DisplayContainer>
        )
    } else {
        return(
            <DisplayContainer ref={displayContainerRef}>
                <DisplayHeader>
                    {display.description}
                    <FullscreenButtonComponent target={displayContainerRef}/>
                </DisplayHeader>
                <IFrameComponent display={display}/>
                { display.actionIdentifier && <ActionButton onClick={handleOnClick}/> }
            </DisplayContainer>
        )
    }

};
export default DashboardDisplayComponent;