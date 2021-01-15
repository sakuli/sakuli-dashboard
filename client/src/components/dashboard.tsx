import React, { useEffect, useState } from 'react';
import DashboardDisplays from "./dashboard-displays";
import { getDashboardConfig } from "../services/dashboard-backend.service";
import { Display, LayoutMode } from "@sakuli-dashboard/api";
import { BackendError, isBackendError, isDashboardConfigResponse } from "@sakuli-dashboard/api/dist";
import DashboardPlaceholder from "./dashboard-placeholder";

interface DashboardProps {
    layout: LayoutMode;
    locale: string;
}

const Dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {

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
            <DashboardDisplays displays={displays} layout={props.layout} locale={props.locale}/>
        );
    } else {
        return (
            <DashboardPlaceholder backendError={backendError}/>
        );
    }
};
export default Dashboard;