import React, { useState } from "react";
import { DataProvider } from "../Universal";
import { NavigationGroup, NavigationItem } from "../Global";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartPie,
    faCircle,
    faCogs,
    faNetworkWired,
    faInbox
} from "@fortawesome/free-solid-svg-icons";
import OopCore from "../../OopCore";

const SideNavigation = props => {
    const [deviceGroups, setDeviceGroups] = useState([]);
    const [devicesAccordionOpen, setDevicesAccordionOpen] = useState(false);
    const [settingsAccordionOpen, setSettingsAccordionOpen] = useState(false);
    const [devicesRenderKey, setDevicesRenderKey] = useState(false);
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
                devices: devices
                    .filter(device => device.deviceGroupId === deviceGroup.id)
                    .slice(0, 3),
            };
        });
    };

    const toggleAccordion = () => setSettingsAccordionOpen(false);

    const toggleDevAccordion = () => setDevicesAccordionOpen(false);

    const toggleBothAccordions = () => {
        setDevicesAccordionOpen(false);
        setSettingsAccordionOpen(false);
    }

    const getDeviceGroups = () => {
        if (props.site) {
            return OopCore.getDevicesByGroup({ siteId: props.site.id }).then(
                response => {
                    const association = response.sites.find(
                        association => association.id === props.site.id,
                    );
                    return association ? association.deviceGroups : [];
                },
            );
        } else {
            return Promise.all([
                OopCore.getDevices({ "page[size]": -1 }),
                OopCore.getDeviceGroups({ "page[size]": -1 }),
            ]).then(([devices, deviceGroups]) =>
                createDevicesAccordion(deviceGroups.data, devices.data),
            );
        }
    };

    const devicesSubNavigation = () => {
        return (
            <DataProvider
                getData={() => {
                    return getDeviceGroups().then(response => {
                        setDeviceGroups(response);
                    });
                }}
                renderKey={devicesRenderKey}
                renderData={() => (
                    <NavigationGroup
                        pathName="Devices"
                        isActive={pathIncludes("/devices")}
                        isOpen={devicesAccordionOpen}
                        setOpen={status => {
                            setDevicesAccordionOpen(status);
                            if (status) {
                                setDevicesRenderKey(!devicesRenderKey);
                            }
                        }}
                        icon={<FontAwesomeIcon icon={faNetworkWired} />}
                    >
                        {props.site && props.site.fullName && (
                            <>
                                <div className="site-name">
                                    <FontAwesomeIcon
                                        className="mr-1"
                                        icon={faCircle}
                                    />
                                    {props.site.fullName}
                                </div>
                            </>
                        )}
                        {deviceGroups.map((group, index) => (
                            <React.Fragment key={`device-group-${index}`}>
                                <NavigationItem
                                    pathName={group.name}
                                    path={`/devices?filter=deviceGroupId-${group.id}`}
                                    onClick={toggleDevAccordion}
                                    className="group-name"
                                />
                                {group.devices.length ? (
                                    group.devices
                                        .slice(0, 3)
                                        .map(device => (
                                            <NavigationItem
                                                className="device-name"
                                                onClick={toggleDevAccordion}
                                                key={`device-${device.id}-navigation-item`}
                                                path={`/devices/${device.id}`}
                                                pathName={device.name}
                                                isActive={pathIncludes(
                                                    `/devices/${device.id}`,
                                                )}
                                            />
                                        ))
                                ) : (
                                    <NavigationItem disabled>
                                        No devices
                                    </NavigationItem>
                                )}
                            </React.Fragment>
                        ))}
                        <NavigationItem
                            className="bottom"
                            path={`/devices`}
                            pathName="View All"
                            onClick={toggleDevAccordion}
                        />
                    </NavigationGroup>
                )}
                dataFallback={
                    <NavigationItem
                        path="/devices"
                        pathName="Devices"
                        isActive={pathMatch("/devices")}
                        icon={<FontAwesomeIcon icon={faNetworkWired} />}
                    />
                }
                loadingFallback={
                    <NavigationItem
                        path="/devices"
                        pathName="Devices"
                        isActive={pathMatch("/devices")}
                        icon={<FontAwesomeIcon icon={faNetworkWired} />}
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
                onClick={toggleBothAccordions}
                icon={<FontAwesomeIcon icon={faChartPie} />}
            />
            {devicesSubNavigation()}
            <NavigationItem
                path="/messages"
                pathName="Messages"
                isActive={pathIncludes("/messages")}
                onClick={toggleBothAccordions}
                icon={<FontAwesomeIcon icon={faInbox} />}
            />
            <NavigationGroup
                isActive={
                    pathIncludes("/users") ||
                    pathIncludes("/sites") ||
                    pathIncludes("/temprs") ||
                    pathIncludes("/device-groups") ||
                    pathIncludes("/transmissions") ||
                    pathIncludes("/global-history")
                }
                pathName="Settings"
                isOpen={settingsAccordionOpen}
                setOpen={setSettingsAccordionOpen}
                icon={<FontAwesomeIcon icon={faCogs} />}
            >
                <NavigationItem
                    path="/users"
                    pathName="Users"
                    onClick={toggleAccordion}
                    isActive={pathIncludes("/users")}
                />
                <NavigationItem
                    path="/sites"
                    pathName="Sites"
                    onClick={toggleAccordion}
                    isActive={pathIncludes("/sites")}
                />
                <NavigationItem
                    path="/temprs"
                    pathName="Temprs"
                    onClick={toggleAccordion}
                    isActive={pathIncludes("/temprs")}
                />
                <NavigationItem
                    path="/device-groups"
                    pathName="Device Groups"
                    onClick={toggleAccordion}
                    isActive={pathIncludes("/device-groups")}
                />
                <NavigationItem
                    path="/schedules"
                    pathName="Schedules"
                    onClick={toggleAccordion}
                    isActive={pathIncludes("/schedules")}
                />
                <NavigationItem
                    path="/layers"
                    pathName="Layers"
                    onClick={toggleAccordion}
                    isActive={pathIncludes("/layers")}
                />
                <NavigationItem
                    path="/blacklist-entries"
                    pathName="Blacklist"
                    onClick={toggleAccordion}
                    isActive={pathIncludes("/blacklist-entries")}
                />
                <NavigationItem
                    path="/transmissions"
                    pathName="Transmissions"
                    onClick={toggleAccordion}
                    isActive={pathIncludes("/transmissions")}
                />
                <NavigationItem
                    path="/global-history"
                    pathName="Global History"
                    onClick={toggleAccordion}
                    isActive={pathIncludes("/global-history")}
                />
                <NavigationItem
                    path="/account"
                    pathName="Account"
                    onClick={toggleAccordion}
                    isActive={pathIncludes("/account")}
                />
            </NavigationGroup>
            <div className="filler" />
        </div>
    );
};

export { SideNavigation };
