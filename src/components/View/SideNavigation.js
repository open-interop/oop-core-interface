import React, { useState, useEffect } from "react";
import { NavigationGroup, NavigationItem } from "../Global";
import OopCore from "../../OopCore";

const SideNavigation = props => {
    const [deviceGroups, setDeviceGroups] = useState([]);
    const [devicesAccordionOpen, setDevicesAccordionOpen] = useState(false);
    const [settingsAccordionOpen, setSettingsAccordionOpen] = useState(false);
    const pathMatch = path => {
        return props.history.location.pathname === path;
    };

    const pathIncludes = path => {
        return props.history.location.pathname.includes(path);
    };

    const set = (deviceGroups, devices) => {
        const result = deviceGroups.map(deviceGroup => {
            return {
                id: deviceGroup.id,
                name: deviceGroup.name,
                devices: devices.filter(
                    device => device.deviceGroupId === deviceGroup.id,
                ),
            };
        });

        return setDeviceGroups(result);
    };

    useEffect(() => {
        Promise.all([OopCore.getDeviceGroups(), OopCore.getDevices()])
            .then(([deviceGroups, devices]) => {
                return set(deviceGroups.data, devices.data);
            })
            .catch(() => set([]));
    }, [devicesAccordionOpen]);

    const devicesSubNavigation = () => {
        if (deviceGroups && deviceGroups.length) {
            return (
                <NavigationGroup
                    pathName="Devices"
                    isActive={pathIncludes("/devices")}
                    isOpen={devicesAccordionOpen}
                    setOpen={setDevicesAccordionOpen}
                >
                    {deviceGroups.map((group, index) => (
                        <React.Fragment key={`device-group-${index}`}>
                            <NavigationItem
                                pathName={group.name}
                                path="/devices"
                                className="group-name"
                            />
                            {group.devices.length ? (
                                group.devices
                                    .slice(0, 3)
                                    .map(device => (
                                        <NavigationItem
                                            className="device-name"
                                            key={`device-${device.id}-navigation-item`}
                                            path={`/devices/${device.id}`}
                                            pathName={device.name}
                                            isActive={pathIncludes(
                                                `/devices/${device.id}`,
                                            )}
                                        />
                                    ))
                            ) : (
                                <div className="navigation-item">
                                    No devices
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                    <NavigationItem
                        className="bottom"
                        path={`/devices`}
                        pathName="View All"
                    />
                </NavigationGroup>
            );
        } else {
            return (
                <NavigationItem
                    path="/devices"
                    pathName="Devices"
                    isActive={pathIncludes("/devices")}
                />
            );
        }
    };
    return (
        <div className="side-navigation">
            <NavigationItem
                path="/"
                pathName="Home"
                isActive={pathMatch("/")}
            />
            {devicesSubNavigation()}
            <NavigationGroup
                isActive={
                    pathIncludes("/users") || pathIncludes("/device-groups")
                }
                pathName="Settings"
                isOpen={settingsAccordionOpen}
                setOpen={setSettingsAccordionOpen}
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
