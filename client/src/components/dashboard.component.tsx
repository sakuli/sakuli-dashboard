import React, {useEffect, useState} from 'react';
import background from '../static/bg.png';
import DashboardDisplaysComponent from "./dashboard-displays.component";
import {getDashboardConfig} from "../services/dashboard-backend.service";
import {Display} from "@sakuli-dashboard/api";
import styled from "styled-components";
import {LayoutMode} from "../App";
import { BackendError, isBackendError, isDashboardConfigResponse } from "@sakuli-dashboard/api/dist";
import ErrorMessageBanner from "./error-message-banner.component";

interface DashboardProps {
    layout: LayoutMode;
    locale: string;
}

const DashboardComponent: React.FC<DashboardProps> = (props: DashboardProps) => {

    const [displays, setDisplays] = useState<Display[]>([]);
    const [backendError, setBackendError] = useState<BackendError>();

    const PlaceHolderDiv = styled.div`
        margin-top: 200px
    `;

    const DashboardHeading = styled.h1`
        font-size: 70pt;
    `;

    useEffect(() => {
        (async function handleDashboardConfigResponse() {
            const response = await getDashboardConfig()
            if(isDashboardConfigResponse(response)) {
                setDisplays(response.displays)
            } else if (isBackendError(response)) {
                setBackendError(response);
            }
        })();
    }, []);

    if (displays.length > 0) {
        return <DashboardDisplaysComponent displays={displays} layout={props.layout} locale={props.locale}/>;
    } else {
        return (
            <PlaceHolderDiv>
                {backendError ? <ErrorMessageBanner errorMessage={backendError.message}/> : <React.Fragment/>}
                <img alt={"Background"} src={background}/>
                <DashboardHeading>DASHBOARD</DashboardHeading>
            </PlaceHolderDiv>);
    }
};
export default DashboardComponent;