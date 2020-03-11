import React from 'react';
import DashboardDisplayComponent from "./dashboard-display.component";
import { Display } from "@sakuli-dashboard/api";
import styled from "styled-components";
import {LayoutMode} from "../App";

interface DisplaysProps {
    displays: Display[];
    layout: LayoutMode;
    locale: string;
}

const DashboardDisplaysComponent: React.FC<DisplaysProps> = (props: DisplaysProps) => {
    const DashboardContainer = styled.div`
        display: flex;
        flex-direction: ${props.layout};
        justify-content: space-between;
        margin-left: auto;
        margin-right: auto;
    `;
    return (
        <DashboardContainer>
            {[...props.displays]
                .sort((a, b) => a.index - b.index)
                .map(display => <DashboardDisplayComponent key={display.index} display={display} layout={props.layout} locale={props.locale}/>)}
        </DashboardContainer>);
};
export default DashboardDisplaysComponent;