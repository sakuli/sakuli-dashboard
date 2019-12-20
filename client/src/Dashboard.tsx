import React, { useEffect, useState } from 'react';
import { Display } from "../../server/src/api/dashboard-response.interface";
import background from './static/bg.png';
import './Dashboard.css';
import Displays from "./Displays";

const Dashboard: React.FC = () => {

    const [displays, setDisplays] = useState<Display[]>([]);

    useEffect(() => {
        fetch('/api/dashboard')
            .then(r => r.json())
            .then(d => setDisplays(d.displays))
    }, []);

    if(displays){
        return (
            <div>
                <Displays {...displays}/>
            </div>);
    }else{
        return (
            <div className={"no-config"}>
                <img alt={"Background"} src={background}/>
                <h1 className={"dashboard"}>DASHBOARD</h1>
            </div>);
    }
};
export default Dashboard;