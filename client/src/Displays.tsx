import React, { useEffect, useState } from 'react';
import { DisplaysResponse } from "../../server/src/api/displays-response.interface";
import background from './static/bg.png';
import Iframe from "react-iframe";
import './Displays.css';

const Displays: React.FC = () => {

    const [displays, setDisplays] = useState<DisplaysResponse>([]);

    useEffect(() => {
        fetch('/api/displays')
            .then(r => r.json())
            .then(d => setDisplays(d))
    }, []);

    if(displays.length){
        return (
            <div>
                {displays.sort((a, b) => a.index - b.index)
                    .map(display => (
                        <Iframe
                            url={display.url}
                            width={display.width || "49%"}
                            height={display.height || "1000px"}
                            display={"inline"}
                        />
                    ))}
            </div>);
    }else{
        return (
            <div className={"no-config"}>
                <img alt={"Background"} src={background}/>
                <h1 className={"dashboard"}>DASHBOARD</h1>
            </div>);
    }
};
export default Displays;