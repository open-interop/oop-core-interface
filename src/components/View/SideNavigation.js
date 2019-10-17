import React, { useState, useEffect, useRef } from "react";
import { Navigation } from "baseui/side-navigation";

const useOutsideClick = (ref, callback) => {
    const handleClick = e => {
        if (ref.current && !ref.current.contains(e.target)) {
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

const SideNavigation = props => {
    const [settingsNavigationOpen, setSettingsNavigationOpen] = useState(false);

    const SettingsNavigation = () => {
        const ref = useRef();
        useOutsideClick(ref, () => {
            setSettingsNavigationOpen(false);
        });

        const getSubActiveItem = () => {
            const activeItem = props.subItems
                .filter(item => item.itemId !== "/")
                .find(item =>
                    props.history.location.pathname.includes(item.itemId),
                );

            return activeItem ? activeItem.itemId : "/";
        };

        return (
            <div
                ref={ref}
                className={`secondary-side-navigation-${
                    settingsNavigationOpen ? "open" : "closed"
                }`}
            >
                <Navigation
                    activeItemId={getSubActiveItem()}
                    items={props.subItems}
                    onChange={({ event, item }) => {
                        event.preventDefault();
                        props.history.push(item.itemId);
                        setSettingsNavigationOpen(false);
                    }}
                />
            </div>
        );
    };

    const getActiveItem = () => {
        if (settingsNavigationOpen) {
            return "/settings";
        }

        if (props.history.location.pathname === "/") {
            return props.history.location.pathname;
        }

        const activeItem = props.items
            .filter(item => item.itemId !== "/")
            .find(
                item =>
                    props.history.location.pathname.includes(item.itemId) ||
                    (item.subItems &&
                        item.subItems.find(
                            subItem =>
                                subItem === props.history.location.pathname,
                        )),
            );

        return activeItem ? activeItem.itemId : "/";
    };

    const changeNavigationItem = item => {
        if (item.itemId === "/" || item.itemId === "/devices") {
            setSettingsNavigationOpen(false);
            props.history.push(item.itemId);
        } else {
            setSettingsNavigationOpen(true);
        }
    };

    return (
        <>
            <div className="primary-side-navigation">
                <Navigation
                    items={props.items}
                    activeItemId={getActiveItem()}
                    onChange={({ event, item }) => {
                        event.preventDefault();
                        changeNavigationItem(item);
                    }}
                />
            </div>
            <SettingsNavigation />
        </>
    );
};

export { SideNavigation };
