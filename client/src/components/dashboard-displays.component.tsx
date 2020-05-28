import React from 'react';
import DashboardDisplayComponent from "./dashboard-display.component";
import {Display} from "@sakuli-dashboard/api";
import {LayoutMode} from "../App";
import Container from 'react-bootstrap/Container';

interface DisplaysProps {
    displays: Display[];
    layout: LayoutMode;
    locale: string;
}

const DashboardDisplaysComponent: React.FC<DisplaysProps> = (props: DisplaysProps) => {

    return (
        <Container>
            {[...props.displays]
                .sort((a, b) => a.index - b.index)
                .map(display => <DashboardDisplayComponent key={display.index} display={display} layout={props.layout}
                                                           locale={props.locale}/>)}
        </Container>
    );
};
export default DashboardDisplaysComponent;