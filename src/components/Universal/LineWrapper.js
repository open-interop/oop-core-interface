import React from "react";

const LineWrapper = props => {
    return (
        <div className="form-wrapper">
            <div className="form-wrapper-title">{props.title}</div>
            {props.children}
        </div>
    );
};

export { LineWrapper };
