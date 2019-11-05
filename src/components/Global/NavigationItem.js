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
                ref={props.refName}
            >
                <span>{props.pathName}</span>
            </div>
        );
    } else {
        return (
            <Link
                onClick={props.onClick}
                to={props.path}
                className={`navigation-item${props.isActive ? " active" : ""} ${
                    props.className
                }`}
            >
                {props.symbol}
                {props.pathName}
            </Link>
        );
    }
};

export { NavigationItem };
