import React, { useEffect, useState } from 'react';
import { Display } from "../../server/src/api/dashboard-config-response.interface";
import background from './static/bg.png';
import './Dashboard.css';
import DashboardDisplays from "./DashboardDisplays";
import { getDashboardConfig } from "./DashboardBackendService";

const Dashboard: React.FC = () => {

    const [displays, setDisplays] = useState<Display[]>([]);

    useEffect(() => {
        getDashboardConfig()
            .then(d => setDisplays(d.displays))
    }, []);

    if(displays){
        return <DashboardDisplays displays={displays}/>;
    }else{
        return (
            <div className={"no-config"}>
                <img alt={"Background"} src={background}/>
                <h1 className={"dashboard"}>DASHBOARD</h1>
            </div>);
    }
};
export default Dashboard;