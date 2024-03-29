import React, { useState } from 'react';
import { faCompressAlt, faExpandAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from 'react-bootstrap/Button';

interface FullscreenButtonProps {
    target: React.RefObject<HTMLElement>
}

const FullscreenButton: React.FC<FullscreenButtonProps> = (props: FullscreenButtonProps) => {
    const [isFullscreen, setFullscreen] = useState(false);

    const toggleFullscreen = async (target: React.RefObject<HTMLElement>) => {
        if (!document.fullscreenEnabled) {
            console.error(`Failed to enable fullscreen mode, not supported!`);
            return;
        }
        try {
            const domNode = target.current;
            if (domNode && !isFullscreen) {
                domNode.onfullscreenchange = _ => {
                    if (document.fullscreenElement) {
                        setFullscreen(true);
                    } else {
                        setFullscreen(false);
                    }
                };
                domNode.onfullscreenerror = _ => {
                    setFullscreen(false);
                };
                await domNode.requestFullscreen({navigationUI: "show"});
            } else if (domNode && isFullscreen) {
                await document.exitFullscreen();
                setFullscreen(false);
            } else {
                console.error(`Error: No element specified to enable fullscreen mode for`);
                setFullscreen(false);
            }
        } catch (e) {
            console.error(`Failed to enable fullscreen mode: ${e}`);
            setFullscreen(false);
        }
    };

    return (
        <Button variant={"light"} className={"float-right"} size={"sm"} onClick={() => toggleFullscreen(props.target)}>
            {isFullscreen ? <FontAwesomeIcon icon={faCompressAlt}/> : <FontAwesomeIcon icon={faExpandAlt}/>}
        </Button>
    );
};
export default FullscreenButton;
