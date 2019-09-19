import * as React from "react";
import { Navigation } from "baseui/side-navigation";
import logo from "../../resources/open_interop_logo_square.png";

const SideNavigation = props => {
    return (
        <>
            <img src={logo} alt="logo" />
            <Navigation
                items={[
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
                ]}
                activeItemId={props.history.location.pathname}
                onChange={({ event, item }) => {
                    event.preventDefault();
                    props.history.push(item.itemId);
                }}
            />
        </>
    );
};

export { SideNavigation };
