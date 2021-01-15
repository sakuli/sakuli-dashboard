import React, { useEffect, useState } from 'react';
import DashboardDisplays from "./dashboard-displays";
import { getDashboardConfig } from "../services/dashboard-backend.service";
import { Display } from "@sakuli-dashboard/api";
import { BackendError, isBackendError, isDashboardConfigResponse } from "@sakuli-dashboard/api/dist";
import DashboardPlaceholder from "./dashboard-placeholder";
import { useLocale } from "../hooks/use-locale";
import { useLayout } from "../hooks/use-layout";
import DashboardHeader from "./dashboard-header";
import Container from "react-bootstrap/Container";

const Dashboard: React.FC = () => {

    const [displays, setDisplays] = useState<Display[]>([]);
    const [backendError, setBackendError] = useState<BackendError>();
    const [currentLayout, setLayout] = useLayout()
    const locale = useLocale();
    let appContainerRef: React.RefObject<HTMLDivElement> = React.createRef();

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

    function renderDisplays(){
        if (displays.length > 0) {
            return (
                <DashboardDisplays displays={displays} layout={currentLayout} locale={locale}/>
            );
        } else {
            return (
                <DashboardPlaceholder backendError={backendError}/>
            );
        }
    }

    return(
        <div className={"vertical-scroll"} ref={appContainerRef}>
            <DashboardHeader
                appContainerRef={appContainerRef}
                currentLayout={currentLayout}
                locale={locale}
                handleOnClick={setLayout}
            />
            <Container fluid={true}>
                {renderDisplays()}
            </Container>
        </div>
    )
};
export default Dashboard;