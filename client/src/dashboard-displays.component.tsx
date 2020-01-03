import React from 'react';
import './Dashboard.css';
import { Display } from "../../server/src/api/dashboard-config-response.interface";
import DashboardDisplayComponent from "./dashboard-display.component";
import 'bulma/css/bulma.css'

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