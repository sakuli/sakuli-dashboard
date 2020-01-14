import React, { useState } from 'react';
import './Dashboard.css';
import ActionButton from "./action-button.component";
import 'bulma/css/bulma.css'
import LoadingScreenComponent from "./loading-screen.component";
import IFrameComponent from "./iframe.component";
import { DashboardActionResponse, Display } from "server";
import { reloadUrl } from "../functions/reload-url.function";
import { pageIsAvailable } from "../functions/page-is-available.function";

interface DisplayProps {
    display: Display
}
const DashboardDisplayComponent: React.FC<DisplayProps> = (props) => {

    const [display, setDisplay] = useState(props.display);
    const [isLoading, setIsLoading] = useState(false);

    function handleResponse(resp: DashboardActionResponse){
        const newUrl = resp.url || reloadUrl(display.url);
        setIsLoading(true);

        pageIsAvailable(newUrl, resp.pollingInterval || 1000)
            .then(() => {
                setDisplay({...display, url: newUrl});
                setIsLoading(false);
            })
    }

    return(
        <div className={"column is-half"}>
            <div>
                {isLoading ? <LoadingScreenComponent/> : <IFrameComponent display={display}/>}
            </div>
            <ActionButton onResponse={handleResponse} display={display}/>
        </div>
    )
};
export default DashboardDisplayComponent;