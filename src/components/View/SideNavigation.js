import React, { useState } from "react";
import { NavigationGroup, NavigationItem } from "../Global";

const SideNavigation = props => {
    const [settingsNavOpen, setSettingsNavOpen] = useState(false);

    const pathMatch = path => {
        return props.history.location.pathname === path;
    };

    const pathIncludes = path => {
        return props.history.location.pathname.includes(path);
    };

    return (
        <div className="side-navigation">
            <NavigationItem
                path="/"
                pathName="Home"
                isActive={!settingsNavOpen && pathMatch("/")}
            />
            <NavigationItem
                path="/devices"
                pathName="Devices"
                isActive={!settingsNavOpen && pathIncludes("/devices")}
            />

            <NavigationGroup
                isActive={
                    settingsNavOpen ||
                    pathIncludes("/users") ||
                    pathIncludes("/device-groups")
                }
                isOpen={settingsNavOpen}
                setOpen={isOpen => setSettingsNavOpen(isOpen)}
                path="/settings"
                pathName="Settings"
            >
                <NavigationItem
                    path="/users"
                    pathName="Users"
                    isActive={pathIncludes("/users")}
                />
                <NavigationItem
                    path="/device-groups"
                    pathName="Device Groups"
                    isActive={pathIncludes("/device-groups")}
                />
            </NavigationGroup>
            <div className="filler" />
        </div>
    );
};

export { SideNavigation };
