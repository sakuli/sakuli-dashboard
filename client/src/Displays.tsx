import React, { useState } from 'react';
import { Display } from "../../server/src/api/dashboard-response.interface";
import Iframe from "react-iframe";
import './Dashboard.css';

const Displays: React.FC<Display[]> = (...props) => {

    const [displays] = useState<Display[]>(props);

    return (
        <div>
            {displays
                .sort((a, b) => a.index - b.index)
                .map(display => (
                    <Iframe
                        key={display.index}
                        url={display.url}
                        width={display.width || "49%"}
                        height={display.height || "1000px"}
                        display={"inline"}
                    />
                ))}
        </div>);
};
export default Displays;