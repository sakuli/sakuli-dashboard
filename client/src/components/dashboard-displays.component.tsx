import React from 'react';
import DashboardDisplayComponent from "./dashboard-display.component";
import { Display } from "server";
import "./dashboard-displays.component.css";

interface DisplaysProps {
    displays: Display[]
}
const DashboardDisplaysComponent: React.FC<DisplaysProps> = ({displays}) => {

    return (
        <div className={"dashboard-container"}>
            {[...displays]
                .sort((a, b) => a.index - b.index)
                .map(display => <DashboardDisplayComponent key={display.index} display={display}/>)}
        </div>);
};
export default DashboardDisplaysComponent;