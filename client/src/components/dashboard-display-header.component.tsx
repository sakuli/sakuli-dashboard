import ActionButton from "./action-button.component";
import FullscreenButtonComponent from "./fullscreen-button.component";
import React from "react";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {Display} from "@sakuli-dashboard/api";

interface DashboardDisplayHeaderProps {
    locale: string
    display: Display
    displayContainerRef: React.RefObject<HTMLDivElement>
    onClick: () => void
    isLoading: boolean
    pageIsAvailable: boolean
}

const DashboardDisplayHeaderComponent: React.FC<DashboardDisplayHeaderProps> = (props:DashboardDisplayHeaderProps) => {
    const infoPopover = () => {
        const infoText = props.display.messages?.[props.locale]?.infoText;
        if (infoText) {
            return (
                <Tippy content={infoText}>
                    <span><FontAwesomeIcon icon={faInfoCircle}/></span>
                </Tippy>
            );
        }

    };

    return (
        <div className={"row justify-content-between my-2 mx-auto pb-1 border-bottom border-success"}>
            <div className={"col-5 pl-1 align-self-center"}>
                <div className={"row flex-nowrap"}>
                    <div className={"col-1 align-self-center"}>
                        {infoPopover()}
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
            <div data-testid={`display-header-fullscreen-${props.display.index}`} className={"col-5 pr-1 align-self-center"}>
                <FullscreenButtonComponent target={props.displayContainerRef}/>
            </div>
        </div>
    );
}
export default DashboardDisplayHeaderComponent;