import React from "react";
import { Link } from "react-router-dom";

const NavigationItem = props => {
    if (props.button) {
        return (
            <div
                className={`navigation-item${props.isActive ? " active" : ""}`}
                onClick={props.onClick}
            >
                <span ref={props.refName}>{props.pathName}</span>
            </div>
        );
    } else {
        return (
            <div
                className={`navigation-item${props.isActive ? " active" : ""}`}
            >
                <Link onClick={props.onClick} to={props.path}>
                    {props.pathName}
                </Link>
            </div>
        );
    }
};

export { NavigationItem };
