import React, { useState } from "react";
import { DataProvider } from "../Universal";
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

    const createDevicesAccordion = (deviceGroups, devices) => {
        return deviceGroups.map(deviceGroup => {
            return {
                id: deviceGroup.id,
                name: deviceGroup.name,
                devices: devices.filter(
                    device => device.deviceGroupId === deviceGroup.id,
                ),
            };
        });
    };

    const getDeviceGroups = () => {
        return Promise.all([
            OopCore.getDeviceGroups(),
            OopCore.getDevices(),
        ]).then(([deviceGroups, devices]) =>
            createDevicesAccordion(deviceGroups.data, devices.data),
        );
    };

    const devicesSubNavigation = () => {
        return (
            <DataProvider
                getData={() => {
                    return getDeviceGroups().then(response => {
                        setDeviceGroups(response);
                        return response;
                    });
                }}
                renderKey={devicesAccordionOpen}
                renderData={() => (
                    <NavigationGroup
                        pathName="Devices"
                        isActive={pathIncludes("/devices")}
                        isOpen={devicesAccordionOpen}
                        setOpen={setDevicesAccordionOpen}
                        render={callback => {
                            return (
                                <>
                                    {deviceGroups.map((group, index) => (
                                        <React.Fragment
                                            key={`device-group-${index}`}
                                        >
                                            <NavigationItem
                                                pathName={group.name}
                                                path="/devices"
                                                className="group-name"
                                                onClick={callback}
                                            />
                                            {group.devices.length ? (
                                                group.devices
                                                    .slice(0, 3)
                                                    .map(device => (
                                                        <NavigationItem
                                                            className="device-name"
                                                            key={`device-${device.id}-navigation-item`}
                                                            path={`/devices/${device.id}`}
                                                            pathName={
                                                                device.name
                                                            }
                                                            isActive={pathIncludes(
                                                                `/devices/${device.id}`,
                                                            )}
                                                            onClick={callback}
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
                                </>
                            );
                        }}
                    />
                )}
                dataFallback={
                    <NavigationItem
                        path="/devices"
                        pathName="Devices"
                        isActive={pathMatch("/devices")}
                    />
                }
                loadingFallback={
                    <NavigationItem
                        path="/devices"
                        pathName="Devices"
                        isActive={pathMatch("/devices")}
                    />
                }
            />
        );
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
                    pathIncludes("/users") ||
                    pathIncludes("/sites") ||
                    pathIncludes("/device-groups")
                }
                pathName="Settings"
                isOpen={settingsAccordionOpen}
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
                                path="/sites"
                                pathName="Sites"
                                isActive={pathIncludes("/sites")}
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
                setOpen={setSettingsAccordionOpen}
            />
            <div className="filler" />
        </div>
    );
};

export { SideNavigation };
