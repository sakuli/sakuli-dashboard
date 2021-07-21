import React from 'react';
import { Display, LayoutMode } from "@sakuli-dashboard/api";
import { WebsiteDisplay } from "./WebsiteDisplay";
import { LogDisplay } from "./LogDisplay";

interface DisplayProps {
    display: Display;
    layout: LayoutMode;
    locale: string;
}

const DashboardDisplay: React.FC<DisplayProps> = (props: DisplayProps) => {

    let displayContainerRef: React.RefObject<HTMLDivElement> = React.createRef();

    function renderDisplay() {
        if(props.display.type === "logs"){
            return <LogDisplay
                display={props.display}
                locale={props.locale}
                displayContainerRef={displayContainerRef}
            />
        }

        return <WebsiteDisplay
            display={props.display}
            layout={props.layout}
            locale={props.locale}
            displayContainerRef={displayContainerRef}
        />
    }

    return (
        <div className={props.layout === "row" ? "col-6 mt-4" : "col-12 mt-4"} ref={displayContainerRef}>
            {renderDisplay()}
        </div>
    )
}

export default DashboardDisplay;