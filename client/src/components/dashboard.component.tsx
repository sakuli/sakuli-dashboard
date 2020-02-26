import React, {useEffect, useState} from 'react';
import background from '../static/bg.png';
import DashboardDisplaysComponent from "./dashboard-displays.component";
import {getDashboardConfig} from "../services/dashboard-backend.service";
import {Display} from "@sakuli-dashboard/api";
import styled from "styled-components";

const DashboardComponent: React.FC = () => {

    const [displays, setDisplays] = useState<Display[]>([]);

    const PlaceHolderDiv = styled.div`
        margin-top: 200px
    `;

    const DashboardHeading = styled.h1`
        font-size: 70pt;
    `;

    useEffect(() => {
        getDashboardConfig()
            .then(d => setDisplays(d.displays))
    }, []);

    if (displays) {
        return <DashboardDisplaysComponent displays={displays} layout={"column"}/>;
    } else {
        return (
            <PlaceHolderDiv>
                <img alt={"Background"} src={background}/>
                <DashboardHeading>DASHBOARD</DashboardHeading>
            </PlaceHolderDiv>);
    }
};
export default DashboardComponent;