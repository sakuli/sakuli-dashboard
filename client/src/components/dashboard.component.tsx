import React, { useEffect, useState } from 'react';
import background from '../static/bg.png';
import './Dashboard.css';
import DashboardDisplaysComponent from "./dashboard-displays.component";
import { getDashboardConfig } from "../services/dashboard-backend.service";
import { Display } from "../../../server/src/api/dashboard-config-response.interface";

const DashboardComponent: React.FC = () => {

    const [displays, setDisplays] = useState<Display[]>([]);

    useEffect(() => {
        getDashboardConfig()
            .then(d => setDisplays(d.displays))
    }, []);

    if(displays){
        return <DashboardDisplaysComponent displays={displays}/>;
    }else{
        return (
            <div className={"no-config"}>
                <img alt={"Background"} src={background}/>
                <h1 className={"dashboard"}>DASHBOARD</h1>
            </div>);
    }
};
export default DashboardComponent;