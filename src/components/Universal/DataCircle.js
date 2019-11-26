import React from "react";

const DataCircle = props => {
    return (
        <div className="flex-column center">
            <div
                className={`circle circle-200`}
                style={{ backgroundColor: props.color }}
            >
                {props.value}
            </div>
            <div className="data-subtitle">{props.subtitle}</div>
        </div>
    );
};

export { DataCircle };
