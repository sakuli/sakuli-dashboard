import React from 'react';
import { Display, LayoutMode, LoginResponse } from "@sakuli-dashboard/api";
import { WebsiteDisplay } from "./website-display";
import { LogDisplay } from "./log-display";

interface DisplayProps {
    display: Display;
    layout: LayoutMode;
    locale: string;
    loginInformation?: LoginResponse;
}

const DashboardDisplay: React.FC<DisplayProps> = (props: DisplayProps) => {

    let displayContainerRef: React.RefObject<HTMLDivElement> = React.createRef();

    function renderDisplay() {
        if(props.display.type === "logs"){
            return <LogDisplay
                display={props.display}
                locale={props.locale}
                displayContainerRef={displayContainerRef}
                loginInformation={props.loginInformation}
            />
        }

        return <WebsiteDisplay
            display={props.display}
            layout={props.layout}
            locale={props.locale}
            displayContainerRef={displayContainerRef}
            loginInformation={props.loginInformation}
        />
    }

    return (
        <div className={props.layout === "row" ? "col-6 mt-4" : "col-12 mt-4"} ref={displayContainerRef}>
            {renderDisplay()}
        </div>
    )
}

export default DashboardDisplay;