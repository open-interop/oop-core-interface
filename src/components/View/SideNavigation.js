import React, { useState } from "react";
import { DataProvider } from "../Universal";
import { NavigationGroup, NavigationItem } from "../Global";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCaretRight,
    faCircle,
    faFilter,
} from "@fortawesome/free-solid-svg-icons";
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

    const createDevicesAccordion = (deviceGroups, devices, site) => {
        const filteredDevices = devices.filter(
            device => !site || device.siteId === site.id,
        );

        const accordion = deviceGroups.map(deviceGroup => {
            return {
                id: deviceGroup.id,
                name: deviceGroup.name,
                devices: filteredDevices.filter(
                    device => device.deviceGroupId === deviceGroup.id,
                ),
            };
        });

        return accordion;
    };

    const getDevices = () => {
        if (props.site && props.site.id) {
            return OopCore.getDevices({ filters: { siteId: props.site.id } });
        } else {
            return OopCore.getDevices();
        }
    };

    const getDeviceGroups = () => {
        return Promise.all([OopCore.getDeviceGroups(), getDevices()]).then(
            ([deviceGroups, devices]) => {
                return createDevicesAccordion(
                    deviceGroups.data,
                    devices.data,
                    props.site,
                );
            },
        );
    };

    const devicesSubNavigation = () => {
        return (
            <DataProvider
                getData={() => {
                    return getDeviceGroups().then(response => {
                        setDeviceGroups(response);
                    });
                }}
                renderKey={devicesAccordionOpen}
                renderData={() => (
                    <NavigationGroup
                        pathName="Devices"
                        isActive={pathIncludes("/devices")}
                        isOpen={devicesAccordionOpen}
                        setOpen={setDevicesAccordionOpen}
                    >
                        <div className="site-name">
                            <FontAwesomeIcon className="mr-1" icon={faCircle} />
                            {props.site && props.site.fullName
                                ? props.site.fullName
                                : "All sites"}
                        </div>

                        {deviceGroups.map((group, index) => (
                            <React.Fragment key={`device-group-${index}`}>
                                <NavigationItem
                                    pathName={group.name}
                                    path={`/devices?deviceGroupId=${group.id}`}
                                    className="group-name"
                                    symbolRight={
                                        <FontAwesomeIcon
                                            className="align-right"
                                            icon={faFilter}
                                        />
                                    }
                                />
                                {group.devices.length ? (
                                    group.devices
                                        .slice(0, 3)
                                        .map(device => (
                                            <NavigationItem
                                                className="device-name"
                                                key={`device-${device.id}-navigation-item`}
                                                path={`/devices/${device.id}`}
                                                symbolLeft={
                                                    <FontAwesomeIcon
                                                        icon={faCaretRight}
                                                    />
                                                }
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
                setOpen={setSettingsAccordionOpen}
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
