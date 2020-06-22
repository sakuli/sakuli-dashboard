import React from "react";
import Iframe from "react-iframe";
import {Display} from "@sakuli-dashboard/api";
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed';

interface IframeComponentProps {
    display: Display
}

const IFrameComponent: React.FC<IframeComponentProps> = ({display}) => {

    return (
        <ResponsiveEmbed className={"iframe-height"}>
            <Iframe url={display.url}/>
        </ResponsiveEmbed>
    );

};
export default IFrameComponent;