import React, {useState} from 'react';
import DashboardComponent from "./components/dashboard.component";
import DashboardHeaderComponent from "./components/dashboard-header.component";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThLarge, faThList} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const LayoutContext = React.createContext('row');

const App: React.FC = () => {

    const [isRowLayout, setRowLayout] = useState(true);

    const viewModeButton = (isRowLayout: boolean) => {
        return (
            <div className="buttonGroup">
                <button>
                    <FontAwesomeIcon icon={faThLarge}/>
                </button>
                <button>
                    <FontAwesomeIcon icon={faThList}/>
                </button>
            </div>
        )
    };

    const AppDiv = styled.div`
        text-align: center;
        background: #f2f2f2;
        height: 100%;
    `;

    return (
        <AppDiv>
            <DashboardHeaderComponent/>
            <DashboardComponent/>
        </AppDiv>
    );
};

export default App;
