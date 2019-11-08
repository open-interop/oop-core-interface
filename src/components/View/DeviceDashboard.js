import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, KIND } from "baseui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faEdit } from "@fortawesome/free-solid-svg-icons";
import { DataProvider } from "../Universal";
import { ListItem, ListItemLabel } from "baseui/list";
import { Card, StyledBody } from "baseui/card";
import { Map, TileLayer } from "react-leaflet";
import OopCore from "../../OopCore";

const DeviceDashboard = props => {
    const [device, setDevice] = useState({});
    const allDevicesPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    const getData = () => {
        return Promise.all([
            OopCore.getDevice(props.match.params.deviceId),
            OopCore.getSites(),
            OopCore.getDeviceGroups(),
        ]).then(([device, sites, groups]) => {
            device.site = sites.data.find(site => site.id === device.siteId);
            device.group = groups.data.find(
                group => group.id === device.deviceGroupId,
            );
            setDevice(device);
            return device;
        });
    };

    const position = [51.505, -0.09];
    return (
        <div className="content-wrapper">
            <div className="space-between title">
                <Button
                    $as={Link}
                    kind={KIND.minimal}
                    to={allDevicesPath}
                    aria-label="Go back to all devices"
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
                <h2>Device Dashboard</h2>
                <Button
                    $as={Link}
                    kind={KIND.minimal}
                    to={`/devices/${props.match.params.deviceId}/edit`}
                    endEnhancer={() => <FontAwesomeIcon icon={faEdit} />}
                    aria-label="Edit this device"
                >
                    Edit
                </Button>
            </div>
            <DataProvider
                getData={() => {
                    return getData();
                }}
                renderKey={props.location.pathname}
                renderData={() => (
                    <>
                        <div className="space-between">
                            <div className="half">
                                <Card>
                                    <StyledBody>
                                        <ListItem>
                                            <div className="card-label">
                                                <ListItemLabel description="Name">
                                                    {device.name}
                                                </ListItemLabel>
                                            </div>
                                        </ListItem>
                                        <ListItem>
                                            <div className="card-label">
                                                <ListItemLabel description="Site">
                                                    {device.site.fullName}
                                                </ListItemLabel>
                                            </div>
                                        </ListItem>
                                        <ListItem>
                                            <div className="card-label">
                                                <ListItemLabel description="Group">
                                                    {device.group.name}
                                                </ListItemLabel>
                                            </div>
                                        </ListItem>
                                    </StyledBody>
                                </Card>
                            </div>
                            <div className="half">
                                <Card className="map-component">
                                    <Map
                                        center={position}
                                        zoom={10}
                                        className="map-component"
                                    >
                                        <TileLayer
                                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                    </Map>
                                </Card>
                            </div>
                        </div>
                    </>
                )}
            />
        </div>
    );
};

export { DeviceDashboard };
