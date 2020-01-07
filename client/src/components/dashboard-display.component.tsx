import React, { useState } from 'react';
import './Dashboard.css';
import ActionButton from "./action-button.component";
import 'bulma/css/bulma.css'
import LoadingScreenComponent from "./loading-screen.component";
import IFrameComponent from "./iframe.component";
import { Display } from "../../../server/src/api/dashboard-config-response.interface";
import { DashboardActionResponse } from "../../../server/src/api/dashboard-action-response.interface";
import { sleep } from "../functions/sleep.function";
import { reloadUrl } from "../functions/reload-url.function";


interface DisplayProps {
    display: Display
}
const DashboardDisplayComponent: React.FC<DisplayProps> = (props) => {
    
    const [display, setDisplay] = useState(props.display);
    const [isLoading, setIsLoading] = useState(false);

    function handleResponse(resp: DashboardActionResponse){
        setIsLoading(true);
        sleep(resp.reloadDelay || 0)
            .then(() => {
                setDisplay({...display, url: resp.url || reloadUrl(display.url)});
                setIsLoading(false);
            });
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