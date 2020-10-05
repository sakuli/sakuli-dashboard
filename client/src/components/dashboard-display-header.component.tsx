import ActionButton from "./action-button.component";
import FullscreenButtonComponent from "./fullscreen-button.component";
import React, { useRef } from "react";
import {Display} from "@sakuli-dashboard/api";
import InfoPopoverComponent from "./info-popover.component";

interface DashboardDisplayHeaderProps {
    locale: string
    display: Display
    displayContainerRef: React.RefObject<HTMLDivElement>
    onClick: () => void
    isLoading: boolean
    pageIsAvailable: boolean
}

const DashboardDisplayHeaderComponent: React.FC<DashboardDisplayHeaderProps> = (props:DashboardDisplayHeaderProps) => {
    const displayHeaderId = `display-header-${props.display.index}`;
    const displayHeaderRef: React.RefObject<HTMLDivElement> = useRef(null);

    return (
        <div id={displayHeaderId} ref={displayHeaderRef} className={"row justify-content-between my-2 mx-auto pb-1 border-bottom border-success"}>
            <div className={"col-5 pl-1 align-self-center"}>
                <div className={"row flex-nowrap"}>
                    <div className={"col-1 align-self-center"}>
                        <InfoPopoverComponent
                          messages={props.display.messages}
                          displayIndex={props.display.index}
                          target={displayHeaderRef}
                          locale={props.locale}
                        />
                    </div>
                    <div data-testid={`display-header-description-${props.display.index}`} className={"col-10 align-self-center"}>
                        {props.display.messages?.[props.locale]?.description}
                    </div>
                </div>
            </div>
            <div className={"col-2 text-center align-self-center"}>
                {
                    props.display.actionIdentifier &&
                    <ActionButton
                        onClick={props.onClick}
                        isLoading={props.isLoading}
                        pageIsAvailable={props.pageIsAvailable}
                    />
                }
            </div>
            <div className={"col-5 pr-1 align-self-center"}>
                <FullscreenButtonComponent target={props.displayContainerRef}/>
            </div>
        </div>
    );
}
export default DashboardDisplayHeaderComponent;