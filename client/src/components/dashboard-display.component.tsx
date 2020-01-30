import React, { useState } from 'react';
import ActionButton from "./action-button.component";
import LoadingScreenComponent from "./loading-screen.component";
import IFrameComponent from "./iframe.component";
import { DashboardActionResponse, Display, isDashboardActionResponse } from "@sakuli-dashboard/api";
import { reloadUrl } from "../functions/reload-url.function";
import { invokeAction } from "../services/dashboard-backend.service";
import "./dashboard-display.component.css";
import { waitUntilPageIsAvailable } from "../functions/wait-until-page-is-available.function";

interface DisplayProps {
    display: Display
}
const DashboardDisplayComponent: React.FC<DisplayProps> = (props) => {

    const [display, setDisplay] = useState(props.display);
    const [isLoading, setIsLoading] = useState(false);

    function handleOnClick(){
        setIsLoading(true);
        const request = {
            actionIdentifier: display.actionIdentifier
        };
        invokeAction(request)
            .then(json => {
                if(isDashboardActionResponse(json)) {
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

    if (isLoading) {
        return(
            <div className={"display-container"}>
                <div className={"display-header"}>Loading ...</div>
                <LoadingScreenComponent/>
            </div>
        )
    } else {
        return(
            <div className={"display-container"}>
                { display.description && <div className={"display-header"}>{display.description}</div> }
                <IFrameComponent display={display}/>
                { display.actionIdentifier && <ActionButton onClick={handleOnClick}/> }
            </div>
        )
    }

};
export default DashboardDisplayComponent;