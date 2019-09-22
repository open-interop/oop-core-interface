import * as React from "react";
import { Navigation } from "baseui/side-navigation";
import logo from "../../resources/open_interop_logo_square.png";

const SideNavigation = props => {
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
        },
    ];

    const getActiveItem = pathName => {
        if (pathName === "/") {
            return pathName;
        }

        const activeItem = items
            .filter(item => item.itemId !== "/")
            .find(item =>
                props.history.location.pathname.includes(item.itemId),
            );

        return activeItem ? activeItem.itemId : "/";
    };

    return (
        <>
            <img src={logo} alt="logo" />
            <Navigation
                items={items}
                activeItemId={getActiveItem(props.history.location.pathname)}
                onChange={({ event, item }) => {
                    event.preventDefault();
                    props.history.push(item.itemId);
                }}
            />
        </>
    );
};

export { SideNavigation };
