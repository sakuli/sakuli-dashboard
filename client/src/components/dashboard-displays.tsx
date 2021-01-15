import React from 'react';
import DashboardDisplay from "./dashboard-display";
import { Display, LayoutMode } from "@sakuli-dashboard/api";

interface DisplaysProps {
    displays: Display[];
    layout: LayoutMode;
    locale: string;
}

const DashboardDisplays: React.FC<DisplaysProps> = (props: DisplaysProps) => {

    return (
        <div className={props.layout === "row" ? "row" : "row row-cols-2"}>
            {[...props.displays]
                .sort((a, b) => a.index - b.index)
                .map(display => <DashboardDisplay key={display.index} display={display} layout={props.layout}
                                                  locale={props.locale}/>)}
        </div>
    );
};
export default DashboardDisplays;