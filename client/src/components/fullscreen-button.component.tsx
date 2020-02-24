import React, {useState} from 'react';
import "./fullscreen-button.component.css";
import {faExpandAlt, faCompressAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface FullscreenButtonProps {
    target: React.RefObject<HTMLElement>
}

const FullscreenButtonComponent: React.FC<FullscreenButtonProps> = (props: FullscreenButtonProps) => {
    const [isFullscreen, setFullscreen] = useState(false);

    const toggleFullscreen = async (target: React.RefObject<HTMLElement>) => {
        if (!document.fullscreenEnabled) {
            console.error(`Failed to enable fullscreen mode, not supported!`);
            return;
        }
        try {
            const domNode = target.current;
            if (domNode && !isFullscreen) {
                await domNode.requestFullscreen({navigationUI: "show"});
                setFullscreen(true);
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
        <button className="fullscreen-button" onClick={() => toggleFullscreen(props.target)}>
            { isFullscreen ? <FontAwesomeIcon icon={faCompressAlt}/> : <FontAwesomeIcon icon={faExpandAlt}/> }
        </button>
    );
};
export default FullscreenButtonComponent;
