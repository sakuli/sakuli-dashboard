import React, { useEffect, useRef, useState } from "react";
import DashboardDisplayHeader from "./dashboard-display-header";
import FullscreenButton from "./fullscreen-button";
import InfoPopover from "./info-popover";
import { Display } from "@sakuli-dashboard/api";
import { LazyLog } from 'react-lazylog';
import { getLogsOfAction } from "../services/dashboard-backend.service";
import { sleep } from "../functions/sleep.function";

interface LogDisplayProps {
    display: Display
    locale: string
    displayContainerRef: React.RefObject<HTMLDivElement>
}

export const LogDisplay: React.FC<LogDisplayProps> = (props: LogDisplayProps) => {

    const displayHeaderRef: React.RefObject<HTMLDivElement> = useRef(null);
    const [logs, setLogs] = useState<string>(" ");
    const pollingInterval = 500;
    const [lastPolling, setLastPolling] = useState(Date.now());

    useEffect(() => {
        getLogsOfAction(props.display.actionIdentifier!)
            .then((receivedLogs) => setLogs(receivedLogs))
            .then(() => sleep(pollingInterval))
            .then(() => setLastPolling(Date.now() - pollingInterval));
    }, [lastPolling]);

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
        <div className={"log-window"}>
            <LazyLog enableSearch follow text={logs} />
        </div>
    </div>
    )
}