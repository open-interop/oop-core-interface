import React from "react";
import { Link } from "react-router-dom";

const NavigationItem = props => {
    if (props.button) {
        return (
            <div
                className={`navigation-item${
                    props.isActive ? " active" : ""
                } ${props.className || ""}`}
                onClick={props.onClick}
            >
                <span ref={props.refName}>{props.pathName}</span>
            </div>
        );
    } else {
        return (
            <div
                className={`navigation-item${props.isActive ? " active" : ""} ${
                    props.className
                }`}
            >
                <Link onClick={props.onClick} to={props.path}>
                    {props.symbol}
                    {props.pathName}
                </Link>
            </div>
        );
    }
};

export { NavigationItem };
