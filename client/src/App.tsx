import React, {useState} from 'react';
import DashboardComponent from "./components/dashboard.component";
import DashboardHeaderComponent from "./components/dashboard-header.component";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThLarge, faThList} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

export type LayoutMode = "row" | "column";

const App: React.FC = () => {

    const [currentLayout, setLayout] = useState<LayoutMode>("column");

    const ButtonGroup = styled.div`
        float: right;
    `;
    const RowLayoutButton = styled.button`
        border-radius: 5px;
        background: rgba(212, 212, 212, 0.3);
        font-size: 1rem;
        margin-left: 2px;
        margin-right: 2px;
        color: ${currentLayout === "row" ? "grey" : "lightgray"};
    `;
    const ColumnLayoutButton = styled.button`
        border-radius: 5px;
        background: rgba(212, 212, 212, 0.3);
        font-size: 1rem;
        margin-left: 2px;
        margin-right: 2px;
        color: ${currentLayout === "column" ? "grey" : "lightgray"};
    `;

    const viewModeButton = () => {
        return (
            <ButtonGroup>
                <ColumnLayoutButton onClick={() => setLayout("column")}>
                    <FontAwesomeIcon icon={faThList}/>
                </ColumnLayoutButton>
                <RowLayoutButton onClick={() => setLayout("row")}>
                    <FontAwesomeIcon icon={faThLarge}/>
                </RowLayoutButton>
            </ButtonGroup>
        )
    };

    const AppDiv = styled.div`
        text-align: center;
        background: #f2f2f2;
        height: 100%;
    `;

    return (
        <AppDiv>
            <DashboardHeaderComponent>
                {viewModeButton()}
            </DashboardHeaderComponent>
            <DashboardComponent layout={currentLayout}/>
        </AppDiv>
    );
};

export default App;
