import React from "react";
import Iframe from "react-iframe";
import { Display } from "server";

interface IframeComponentProps {
    display: Display
}
const IFrameComponent: React.FC<IframeComponentProps> = ({display}) => {

    return(
        <Iframe
            url={display.url}
            width={display.width || "100%"}
            height={display.height || "1000px"}
        />
    );
};
export default IFrameComponent;