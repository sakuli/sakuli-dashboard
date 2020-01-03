import React from 'react';
import { Display } from "../../server/src/api/dashboard-config-response.interface";
import Iframe from "react-iframe";
import './Dashboard.css';
import ActionButton from "./action-button.component";
import 'bulma/css/bulma.css'

interface DisplayProps {
    display: Display
}
const DashboardDisplayComponent: React.FC<DisplayProps> = ({display}) => {

    return(
        <div key={display.index} className={"column is-half"}>
            <Iframe
                url={display.url}
                width={display.width || "100%"}
                height={display.height || "1000px"}
                display={"inline"}
            />
            <ActionButton actionIdentifier={display.actionIdentifier}/>
        </div>
    )
};
export default DashboardDisplayComponent;