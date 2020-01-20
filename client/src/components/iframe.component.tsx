import React, { useEffect, useState } from "react";
import Iframe from "react-iframe";
import { Display } from "server";
import "./iframe.component.css";
import { urlAvailable } from "../functions/url-available.function";
import { sleep } from "../functions/sleep.function";
import placeholder from '../static/placeholder.png';

interface IframeComponentProps {
    display: Display
}
const IFrameComponent: React.FC<IframeComponentProps> = ({display}) => {

    const [pageIsAvailable, setPageIsAvailable] = useState(false);
    const [lastPolling, setLastPolling] = useState(Date.now());
    const pollingInterval = 2000;

    useEffect(() => {
        urlAvailable(display.url)
            .then(isUrlAvailable => setPageIsAvailable(isUrlAvailable))
            .then(() => sleep(pollingInterval))
            .then(() => setLastPolling(Date.now() - pollingInterval));
    }, [lastPolling, display.url]);

    if(pageIsAvailable){
        return(
            <Iframe
                className={ (display.actionIdentifier) ? "frame-embed--with-action" : "frame-embed" }
                url={display.url}
            />
        );
    }

    return (
        <div className={ (display.actionIdentifier) ? "frame-embed--with-action" : "frame-embed"}>
            <img alt="placeholder" className={"placeholder"} src={placeholder}/>
        </div>
    )
};
export default IFrameComponent;