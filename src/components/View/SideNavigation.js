import React, { useState } from "react";
import { DataProvider } from "../Universal";
import { NavigationGroup, NavigationItem } from "../Global";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartPie,
    faCircle,
    faCogs,
    faNetworkWired,
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

    const flattenArray = array => {
        return Array.prototype.concat.apply([], array);
    };

    const getAllDeviceGroups = groupsBySite => {
        return groupsBySite;
    };

    const getDeviceGroupsForSite = (siteId, associations) => {
        const abc = associations.find(association => association.id === siteId);
        return abc ? abc.deviceGroups : [];
    };

    const getDeviceGroups = () => {
        if (props.site) {
            return OopCore.getDevicesByGroup({ siteId: props.site.id }).then(
                response => {
                    const deviceGroupsBySite = flattenArray(response.sites);
                    return getDeviceGroupsForSite(
                        props.site.id,
                        deviceGroupsBySite,
                    );
                },
            );
        } else {
            return Promise.resolve([]);
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
                renderKey={`${devicesRenderKey}${
                    props.site ? props.site.id : ""
                }`}
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
                        {props.site && props.site.fullName ? (
                            <>
                                <div className="site-name">
                                    <FontAwesomeIcon
                                        className="mr-1"
                                        icon={faCircle}
                                    />
                                    {props.site.fullName}
                                </div>
                            </>
                        ) : (
                            <NavigationItem
                                className="bottom"
                                path={`/devices`}
                                pathName="View All"
                            />
                        )}

                        {deviceGroups.map((group, index) => (
                            <React.Fragment key={`device-group-${index}`}>
                                <NavigationItem
                                    pathName={group.name}
                                    path={`/devices?deviceGroupId=${group.id}`}
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
                                    <div className="navigation-item no-devices">
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
                icon={<FontAwesomeIcon icon={faChartPie} />}
            />
            {devicesSubNavigation()}
            <NavigationGroup
                isActive={
                    pathIncludes("/users") ||
                    pathIncludes("/sites") ||
                    pathIncludes("/temprs") ||
                    pathIncludes("/device-groups")
                }
                pathName="Settings"
                isOpen={settingsAccordionOpen}
                setOpen={setSettingsAccordionOpen}
                icon={<FontAwesomeIcon icon={faCogs} />}
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
                    path="/temprs"
                    pathName="Temprs"
                    isActive={pathIncludes("/temprs")}
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
