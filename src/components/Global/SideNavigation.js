import * as React from "react";
import { Navigation } from "baseui/side-navigation";

const SideNavigation = props => {
    return (
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
    );
};

export { SideNavigation };
