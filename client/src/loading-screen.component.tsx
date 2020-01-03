import React from "react";
import loading from "./static/loading.gif";

const LoadingScreenComponent: React.FC = () => {

    return(
        <div>
            <img style={{height: "200px"}} src={loading}/>
        </div>);
};
export default LoadingScreenComponent;