import React from "react";
import { Display } from "@sakuli-dashboard/api";

interface DashboardDisplayHeaderProps {
    locale: string
    display: Display
    displayHeaderRef: React.RefObject<HTMLDivElement>
    getLeftElement?: JSX.Element
    getCenterElement?: JSX.Element
    getRightElement?: JSX.Element
}

const DashboardDisplayHeader: React.FC<DashboardDisplayHeaderProps> = (props:DashboardDisplayHeaderProps) => {
    const displayHeaderId = `display-header-${props.display.index}`;


    return (
        <div id={displayHeaderId} ref={props.displayHeaderRef} className={"row justify-content-between my-2 mx-auto pb-1 border-bottom border-success"}>
            <div className={"col-5 pl-1 align-self-center"}>
                <div className={"row flex-nowrap"}>
                    <div className={"col-1 align-self-center"}>
                        {props?.getLeftElement}
                    </div>
                    <div data-testid={`display-header-description-${props.display.index}`} className={"col-10 align-self-center"}>
                        {props.display.messages?.[props.locale]?.description}
                    </div>
                </div>
            </div>
            <div className={"col-2 text-center align-self-center"}>
                {props?.getCenterElement}
            </div>
            <div className={"col-5 pr-1 align-self-center"}>
                {props?.getRightElement}
            </div>
        </div>
    );
}
export default DashboardDisplayHeader;