import Image from "react-bootstrap/Image";
import background from "../static/bg.png";
import ErrorMessageBanner from "./error-message-banner";
import React from "react";
import { BackendError } from "@sakuli-dashboard/api";

interface DashboardPlaceholderProps {
    backendError: BackendError | undefined
}

const DashboardPlaceholder: React.FC<DashboardPlaceholderProps> = (props: DashboardPlaceholderProps) => {
    return (
        <>
            <div className={"row mt-3"}>
                <Image src={background} className={"mx-auto d-block"} fluid={true}/>
            </div>
            <div className={"row justify-content-center"}>
                <h1 className={"text-center"}>DASHBOARD</h1>
            </div>
            <div className={"row justify-content-center"}>
                {props.backendError ? <ErrorMessageBanner errorMessage={props.backendError.message}/> : <React.Fragment/>}
            </div>
        </>
    )
}
export default DashboardPlaceholder;
