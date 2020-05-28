import React, { useEffect, useState } from "react";
import Iframe from "react-iframe";
import { Display } from "@sakuli-dashboard/api";
import { urlAvailable } from "../functions/url-available.function";
import { sleep } from "../functions/sleep.function";
import placeholder from '../static/placeholder.png';
import Image from 'react-bootstrap/Image';
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed';

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
            <ResponsiveEmbed>
                <Iframe url={display.url}/>
            </ResponsiveEmbed>
        );
    }

    return (
            <Image alt="placeholder" className={"placeholder"} src={placeholder} fluid={true}/>
    )
};
export default IFrameComponent;