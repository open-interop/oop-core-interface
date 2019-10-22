import React, { useEffect, useRef, useState } from "react";
import { NavigationItem } from ".";

const useOutsideClick = (ref, exception, callback) => {
    const handleClick = e => {
        if (
            ref.current &&
            ref.current !== e.target &&
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

    const [isOpen, setOpen] = useState(false);

    useOutsideClick(navRef, groupNameRef, () => {
        setOpen(false);
    });

    return (
        <>
            <NavigationItem
                button
                isActive={props.isActive}
                pathName={props.pathName}
                onClick={() => {
                    setOpen(!isOpen);
                }}
                refName={groupNameRef}
            />

            <div
                ref={navRef}
                className={`nested-navigation${isOpen ? " open" : ""}`}
            >
                {props.children}
            </div>
        </>
    );
};

export { NavigationGroup };