import React, {useState} from 'react';
import DashboardComponent from "./components/dashboard.component";
import DashboardHeaderComponent from "./components/dashboard-header.component";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThLarge, faThList} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { useLocale } from "./hooks/use-locale";

export type LayoutMode = "row" | "column";

const App: React.FC = () => {

    const [currentLayout, setLayout] = useState<LayoutMode>("column");

    const locale = useLocale();

    const ButtonGroup = styled.div`
        float: right;
        margin-left: 3px;
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

    const LanguageGroup = styled.div`
        float: right;
        border-right: 1px solid lightgray;
        line-height: 25px;
    `;
    const Language = styled.a`
        margin-left: 4px;
        margin-right: 4px;
        text-decoration: none;
    `;

    const viewLanguageLinks = () => {
        return (
            <LanguageGroup>
                <Language href="?lang=de">{String.fromCodePoint(0x1F1E9, 0x1F1EA)}</Language>
                <Language href="?lang=en">{String.fromCodePoint(0x1F1EC, 0x1F1E7)}</Language>
            </LanguageGroup>
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
                {viewLanguageLinks()}
            </DashboardHeaderComponent>
            <DashboardComponent layout={currentLayout} locale={locale}/>
        </AppDiv>
    );
};

export default App;
