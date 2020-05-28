import React, {useEffect, useState} from 'react';
import background from '../static/bg.png';
import DashboardDisplaysComponent from "./dashboard-displays.component";
import {getDashboardConfig} from "../services/dashboard-backend.service";
import {Display} from "@sakuli-dashboard/api";
import {LayoutMode} from "../App";
import { BackendError, isBackendError, isDashboardConfigResponse } from "@sakuli-dashboard/api/dist";
import ErrorMessageBanner from "./error-message-banner.component";
import Image from 'react-bootstrap/Image'
import Container from 'react-bootstrap/Container'

interface DashboardProps {
    layout: LayoutMode;
    locale: string;
}

const DashboardComponent: React.FC<DashboardProps> = (props: DashboardProps) => {

    const [displays, setDisplays] = useState<Display[]>([]);
    const [backendError, setBackendError] = useState<BackendError>();

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
            <Container>
                {backendError ? <ErrorMessageBanner errorMessage={backendError.message}/> : <React.Fragment/>}
                <Image src={background} className={"mx-auto d-block"}/>
                <h1 className={"text-center"}>DASHBOARD</h1>
            </Container>
        );
    }
};
export default DashboardComponent;