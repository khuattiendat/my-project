import React from "react";
import "./loading.scss";

const LoadingPage = (props) => {
    const {style} = props;
    return (
        <div className="loader_container" >
            <div className="loader" style={style}/>
        </div>
    );
};

export default LoadingPage;
