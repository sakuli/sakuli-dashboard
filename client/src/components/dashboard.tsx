import React, { useEffect, useState } from 'react';
import DashboardDisplays from "./dashboard-displays";
import { getDashboardConfig } from "../services/dashboard-backend.service";
import { BackendError, Display, isBackendError, isDashboardConfigResponse, LoginResponse } from "@sakuli-dashboard/api";
import DashboardPlaceholder from "./dashboard-placeholder";
import { useLocale } from "../hooks/use-locale";
import { useLayout } from "../hooks/use-layout";
import DashboardHeader from "./dashboard-header";
import Container from "react-bootstrap/Container";

export interface DashboardProps {
    loginInformation?: LoginResponse;
}

const Dashboard: React.FC<DashboardProps> = (props) => {

    const [displays, setDisplays] = useState<Display[]>([]);
    const [backendError, setBackendError] = useState<BackendError>();
    const [currentLayout, setLayout, fromLocalStorage] = useLayout()
    const locale = useLocale();
    let appContainerRef: React.RefObject<HTMLDivElement> = React.createRef();

    useEffect(() => {
        (async function handleDashboardConfigResponse() {
            const response = await getDashboardConfig(props.loginInformation?.jwtToken)
            if (isDashboardConfigResponse(response)) {
                setDisplays(response.displays)
                if(!fromLocalStorage && response.defaultLayout){
                    setLayout(response.defaultLayout)
                }
            } else if (isBackendError(response)) {
                setBackendError(response);
            }
        })();
    }, [setLayout, fromLocalStorage, props.loginInformation]);

    function renderDisplays(){
        if (displays.length > 0) {
            return (
                <DashboardDisplays
                    displays={displays}
                    layout={currentLayout}
                    locale={locale}
                    loginInformation={props.loginInformation}/>
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