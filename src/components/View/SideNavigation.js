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
                    pathIncludes("/users") || pathIncludes("/device-groups")
                }
                path="/settings"
                pathName="Settings"
                render={callback => {
                    return (
                        <>
                            <NavigationItem
                                path="/users"
                                pathName="Users"
                                isActive={pathIncludes("/users")}
                                onClick={callback}
                            />
                            <NavigationItem
                                path="/device-groups"
                                pathName="Device Groups"
                                isActive={pathIncludes("/device-groups")}
                                onClick={callback}
                            />
                        </>
                    );
                }}
            />
            <div className="filler" />
        </div>
    );
};

export { SideNavigation };
