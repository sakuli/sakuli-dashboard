import React, { useState } from 'react';
import ActionButton from "./action-button.component";
import LoadingScreenComponent from "./loading-screen.component";
import IFrameComponent from "./iframe.component";
import { DashboardActionResponse, Display } from "server";
import { reloadUrl } from "../functions/reload-url.function";
import { pageIsAvailable } from "../functions/page-is-available.function";
import { invokeAction } from "../services/dashboard-backend.service";
import "./dashboard-display.component.css";

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
            .then(json => handleResponse(json))
            .catch(error => console.error(error));
    }

    function handleResponse(resp: DashboardActionResponse){
        const newUrl = resp.url || reloadUrl(display.url);

        pageIsAvailable(newUrl, resp.pollingInterval || 1000)
            .then(() => {
                setDisplay({...display, url: newUrl});
                setIsLoading(false);
            })
    }

    if (isLoading) {
        return(
            <div className={"display-container"}>
                <LoadingScreenComponent/>
            </div>
        )
    } else {
        return(
            <div className={"display-container"}>
                <IFrameComponent display={display}/>
                <ActionButton onClick={handleOnClick} display={display}/>
            </div>
        )
    }

};
export default DashboardDisplayComponent;