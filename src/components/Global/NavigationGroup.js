import React, { useEffect, useRef } from "react";
import { NavigationItem } from ".";

const useOutsideClick = (ref, exception, callback) => {
    const handleClick = e => {
        if (
            ref.current &&
            !ref.current.contains(e.target) &&
            exception.current !== e.target
        ) {
            callback();
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    });
};

const NavigationGroup = props => {
    const navRef = useRef();
    const groupNameRef = useRef();

    useOutsideClick(navRef, groupNameRef, () => {
        props.setOpen(false);
    });

    return (
        <>
            <NavigationItem
                isActive={props.isActive}
                pathName="Settings"
                onClick={() => {
                    props.setOpen(!props.isOpen);
                }}
                refName={groupNameRef}
            />

            <div
                ref={navRef}
                className={`nested-navigation${props.isOpen ? " open" : ""}`}
            >
                {props.children}
            </div>
        </>
    );
};

export { NavigationGroup };
