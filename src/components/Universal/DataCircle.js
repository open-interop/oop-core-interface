import React from "react";

const DataCircle = props => {
    return (
        <div className="flex-column center width-19 mt-10">
            <div className={`circle`} style={{ backgroundColor: props.color }}>
                {props.value}
            </div>
            <div className="data-subtitle">{props.subtitle}</div>
        </div>
    );
};

export { DataCircle };
