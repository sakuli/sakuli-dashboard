import React from "react";
import Iframe from "react-iframe";
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed';

interface IframeComponentProps {
    url: string
}

const IframeDisplay: React.FC<IframeComponentProps> = (props) => {

    return (
        <ResponsiveEmbed className={"iframe-height"}>
            <Iframe url={props.url}/>
        </ResponsiveEmbed>
    );

};
export default IframeDisplay;