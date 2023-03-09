import React from "react";
import { Link } from "react-router-dom";
import { Button, SIZE } from "baseui/button";

const NavigationItem = props => {
    if (props.button) {
        return (
            <Button
                className={`navigation-item${props.isActive ? " active" : ""} ${props.className ||
                    ""}`}
                onClick={props.onClick}
                ref={props.refName}
                size={SIZE.compact}
            >
                {props.icon && <div className="size-xxl navigation-icon">{props.icon}</div>}
                <span>{props.pathName}</span>
            </Button>
        );
    } else if (props.disabled) {
        return (
            <Button
                className={`navigation-item ${props.className || ""}`}
                size={SIZE.compact}
                disabled
            >
                {props.icon && <div className="size-xxl navigation-icon">{props.icon}</div>}
                <span>{props.children}</span>
            </Button>
        );
    } else {
        return (
            <>
                <Button
                    $as={Link}
                    onClick={props.onClick}
                    to={props.path}
                    className={`navigation-item${props.isActive ? " active" : ""} ${
                        props.className
                    }`}
                    size={SIZE.compact}
                >
                    {props.icon && <div className="size-xxl navigation-icon">{props.icon}</div>}
                    <div>
                        {props.symbolLeft}
                        {props.symbolLeft ? " " : ""}
                        {props.pathName}
                        {props.symbolRight ? " " : ""}
                        {props.symbolRight}
                    </div>
                </Button>
            </>
        );
    }
};

export { NavigationItem };
