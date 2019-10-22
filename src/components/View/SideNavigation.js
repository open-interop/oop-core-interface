import React from "react";
import { NavigationGroup, NavigationItem } from "../Global";

const SideNavigation = props => {
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
                isActive={pathMatch("/")}
            />
            <NavigationItem
                path="/devices"
                pathName="Devices"
                isActive={pathIncludes("/devices")}
            />

            <NavigationGroup
                isActive={
                    pathIncludes("/users") ||
                    pathIncludes("/sites") ||
                    pathIncludes("/device-groups")
                }
                path="/settings"
                pathName="Settings"
            >
                <NavigationItem
                    path="/users"
                    pathName="Users"
                    isActive={pathIncludes("/users")}
                />
                <NavigationItem
                    path="/sites"
                    pathName="Sites"
                    isActive={pathIncludes("/sites")}
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
