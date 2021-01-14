import React, { useEffect, useState } from 'react';
import DashboardDisplaysComponent from "./dashboard-displays.component";
import { getDashboardConfig } from "../services/dashboard-backend.service";
import { Display, LayoutMode } from "@sakuli-dashboard/api";
import { BackendError, isBackendError, isDashboardConfigResponse } from "@sakuli-dashboard/api/dist";
import DashboardPlaceholderComponent from "./dashboard-placeholder.component";

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
            if (isDashboardConfigResponse(response)) {
                setDisplays(response.displays)
            } else if (isBackendError(response)) {
                setBackendError(response);
            }
        })();
    }, []);

    if (displays.length > 0) {
        return (
            <DashboardDisplaysComponent displays={displays} layout={props.layout} locale={props.locale}/>
        );
    } else {
        return (
            <DashboardPlaceholderComponent backendError={backendError}/>
        );
    }
};
export default DashboardComponent;