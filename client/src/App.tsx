import React from 'react';
import './App.css';
import DashboardComponent from "./components/dashboard.component";
import DashboardHeaderComponent from "./components/dashboard-header.component";

const App: React.FC = () => {

  return (
      <div className="App">
        <DashboardHeaderComponent/>
        <DashboardComponent/>
      </div>
  );
};

export default App;
