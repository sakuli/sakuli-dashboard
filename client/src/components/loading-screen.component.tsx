import React from "react";
import "./loading-screen.component.css";

const LoadingScreenComponent: React.FC = () => {

    return (
        <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>);
};
export default LoadingScreenComponent;