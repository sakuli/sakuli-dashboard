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
    const [polling, setPolling] = useState(true);

    useEffect(() => {
        urlAvailable(display.url)
            .then(isUrlAvailable => setPageIsAvailable(isUrlAvailable))
            .then(() => sleep(2000))
            .then(() => setPolling(!polling));
    }, [polling, display.url]);

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