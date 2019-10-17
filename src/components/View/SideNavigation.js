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
        const ref = useRef("test");
        useOutsideClick(ref, () => {
            setSettingsNavigationOpen(false);
        });

        const subItems = [
            {
                title: "Users",
                itemId: "/users",
            },
            {
                title: "Device Groups",
                itemId: "/device-groups",
            },
        ];

        const getSubActiveItem = () => {
            const activeItem = subItems
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
                    items={subItems}
                    onChange={({ event, item }) => {
                        event.preventDefault();
                        props.history.push(item.itemId);
                        setSettingsNavigationOpen(false);
                    }}
                />
            </div>
        );
    };

    const items = [
        {
            title: "Home",
            itemId: "/",
        },
        {
            title: "Devices",
            itemId: "/devices",
        },
        {
            title: "Settings",
            itemId: "/settings",
            subItems: ["/users", "/device-groups"],
        },
    ];

    const getActiveItem = () => {
        if (settingsNavigationOpen) {
            return "/settings";
        }

        if (props.history.location.pathname === "/") {
            return props.history.location.pathname;
        }

        const activeItem = items
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
                    items={items}
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
