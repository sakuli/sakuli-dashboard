import React from 'react';
import styled from "styled-components";

interface DashboardHeaderProps {
    children?: React.ReactNode;
}
const DashboardHeaderComponent: React.FC = (props: DashboardHeaderProps) => {

    const HeaderDiv = styled.div`
        position: sticky;
        top: 0;
        padding: 10px;
        background: white;
        border-bottom: 2px solid #aadd226b;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        text-align: center;
        font-weight: bold;
        color: #523c3c;
        z-index: 100;
    `;

    return (
        <HeaderDiv>Sakuli Dashboard{props.children}</HeaderDiv>
    )
};
export default DashboardHeaderComponent;