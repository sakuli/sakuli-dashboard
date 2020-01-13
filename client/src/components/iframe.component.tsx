import React from "react";
import Iframe from "react-iframe";
import { Display } from "server";
import "./iframe.component.css";

interface IframeComponentProps {
    display: Display
}
const IFrameComponent: React.FC<IframeComponentProps> = ({display}) => {

    return(
        <Iframe
            className="fullscreen"
            url={display.url}
        />
    );
};
export default IFrameComponent;