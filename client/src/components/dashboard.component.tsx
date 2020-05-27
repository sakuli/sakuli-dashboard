import React, {useEffect, useState} from 'react';
import background from '../static/bg.png';
import DashboardDisplaysComponent from "./dashboard-displays.component";
import {getDashboardConfig} from "../services/dashboard-backend.service";
import {Display} from "@sakuli-dashboard/api";
import {LayoutMode} from "../App";
import Image from 'react-bootstrap/Image'
import Container from 'react-bootstrap/Container'

interface DashboardProps {
    layout: LayoutMode;
    locale: string;
}

const DashboardComponent: React.FC<DashboardProps> = (props: DashboardProps) => {

    const [displays, setDisplays] = useState<Display[]>([]);

    useEffect(() => {
        getDashboardConfig()
            .then(d => setDisplays(d.displays))
    }, []);

    if (displays) {
        return <DashboardDisplaysComponent displays={displays} layout={props.layout} locale={props.locale}/>;
    } else {
        return (
            <Container>
                <Image src={background} className={"mx-auto d-block"}/>
                <h1 className={"text-center"}>DASHBOARD</h1>
            </Container>
        );
    }
};
export default DashboardComponent;