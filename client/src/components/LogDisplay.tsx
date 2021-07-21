import React, { useRef } from "react";
import DashboardDisplayHeader from "./dashboard-display-header";
import FullscreenButton from "./fullscreen-button";
import InfoPopover from "./info-popover";
import { Display } from "@sakuli-dashboard/api";

interface LogDisplayProps {
    display: Display
    locale: string
    displayContainerRef: React.RefObject<HTMLDivElement>
}

export const LogDisplay: React.FC<LogDisplayProps> = (props: LogDisplayProps) => {

    const displayHeaderRef: React.RefObject<HTMLDivElement> = useRef(null);

    function renderInfoPopover(){
        return <InfoPopover
            messages={props.display.messages}
            displayIndex={props.display.index}
            target={displayHeaderRef}
            locale={props.locale}
        />;
    }

    return (
    <div>
        <DashboardDisplayHeader
            display={props.display}
            locale={props.locale}
            displayHeaderRef={displayHeaderRef}
            getLeftElement={renderInfoPopover()}
            getRightElement={<FullscreenButton target={props.displayContainerRef}/>}
        />
    </div>
    )
}