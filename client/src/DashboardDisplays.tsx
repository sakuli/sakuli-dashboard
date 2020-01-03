import React from 'react';
import './Dashboard.css';
import { Display } from "../../server/src/api/dashboard-config-response.interface";
import DashboardDisplay from "./DashboardDisplay";
import 'bulma/css/bulma.css'

interface DisplaysProps {
    displays: Display[]
}
const DashboardDisplays: React.FC<DisplaysProps> = ({displays}) => {

    return (
        <div className={"columns is-gapless is-multiline is-mobile"}>
            {[...displays]
                .sort((a, b) => a.index - b.index)
                .map(display => <DashboardDisplay key={display.index} display={display}/>)}
        </div>);
};
export default DashboardDisplays;