import React, { useState } from 'react';
import './Dashboard.css';
import ActionButton from "./action-button.component";
import 'bulma/css/bulma.css'
import LoadingScreenComponent from "./loading-screen.component";
import IFrameComponent from "./iframe.component";
import { Display } from "../../../server/src/api/dashboard-config-response.interface";
import { DashboardActionResponse } from "../../../server/src/api/dashboard-action-response.interface";
import { reloadUrl } from "../functions/reload-url.function";
import { sleep } from "../functions/sleep.function";
import { checkUrl } from "../services/dashboard-backend.service";


interface DisplayProps {
    display: Display
}
const DashboardDisplayComponent: React.FC<DisplayProps> = (props) => {

    const [display, setDisplay] = useState(props.display);
    const [isLoading, setIsLoading] = useState(false);

    function urlNotAvailable(newUrl: string) : Promise<boolean>{
        return new Promise<boolean>((async resolve => {
            checkUrl({url: newUrl})
                .then(response => response.status === 200 ? resolve(false) : resolve(true))
                .catch(() => resolve(true));
        }))
    }

    function pageIsAvailable(newUrl: string, pollingInterval: number): Promise<void> {
        return new Promise<void>((async resolve => {
            while (await urlNotAvailable(newUrl)) {
                await sleep(pollingInterval);
            }
            resolve();
        }))
    }

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