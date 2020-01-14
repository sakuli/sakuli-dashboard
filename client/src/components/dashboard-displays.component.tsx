import React from 'react';
import './Dashboard.css';
import DashboardDisplayComponent from "./dashboard-display.component";
import 'bulma/css/bulma.css'
import { Display } from "server";

interface DisplaysProps {
    displays: Display[]
}
const DashboardDisplaysComponent: React.FC<DisplaysProps> = ({displays}) => {

    return (
        <div className={"columns is-gapless is-multiline is-mobile"}>
            {[...displays]
                .sort((a, b) => a.index - b.index)
                .map(display => <DashboardDisplayComponent key={display.index} display={display}/>)}
        </div>);
};
export default DashboardDisplaysComponent;