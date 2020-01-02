import React from 'react';
import { Display } from "../../server/src/api/dashboard-config-response.interface";
import Iframe from "react-iframe";
import './Dashboard.css';
import ActionButton from "./ActionButton";

interface DisplayProps {
    display: Display
}
const DashboardDisplay: React.FC<DisplayProps> = ({display}) => {

    return(
        <div key={display.index}>
            <Iframe
                url={display.url}
                width={display.width || "2000px"}
                height={display.height || "1000px"}
                display={"inline"}
            />
            <ActionButton actionIdentifier={display.actionIdentifier}/>
        </div>
    )
};
export default DashboardDisplay;