import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, KIND } from "baseui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircle,
    faCheck,
    faChevronLeft,
    faEdit,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { DataProvider, Table } from "../Universal";
import { ListItem, ListItemLabel } from "baseui/list";
import { Card, StyledBody, StyledAction } from "baseui/card";
import { Map, TileLayer, Marker } from "react-leaflet";
import { Doughnut } from "react-chartjs-2";
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
            OopCore.getTransmissions(props.match.params.deviceId, {
                pageSize: 5,
            }),
            OopCore.getDeviceTemprs({
                deviceId: props.match.params.deviceId,
                pageSize: -1,
            }),
        ]).then(([device, sites, groups, transmissions, deviceTemprs]) => {
            device.site = sites.data.find(site => site.id === device.siteId);
            device.group = groups.data.find(
                group => group.id === device.deviceGroupId,
            );
            device.transmissions = transmissions.data;
            device.deviceTemprs = deviceTemprs.data.length;
            setDevice(device);
            return device;
        });
    };

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
                renderData={() => {
                    return (
                        <>
                            <div className="space-between wrap">
                                <div className="width-49">
                                    <Card
                                        className="mb-20 fixed-height"
                                        title={
                                            <div className="space-between">
                                                Details
                                                {device.active ? (
                                                    <div className="active-device smaller">
                                                        <FontAwesomeIcon
                                                            className="blink smaller"
                                                            icon={faCircle}
                                                        />{" "}
                                                        ACTIVE
                                                    </div>
                                                ) : (
                                                    <div className="inactive-device smaller">
                                                        <FontAwesomeIcon
                                                            className="smaller"
                                                            icon={faCircle}
                                                        />{" "}
                                                        INACTIVE
                                                    </div>
                                                )}
                                            </div>
                                        }
                                    >
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
                                                        {device.site
                                                            ? device.site
                                                                  .fullName
                                                            : ""}
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
                                            <ListItem>
                                                <div className="card-label">
                                                    <ListItemLabel description="Device Temprs">
                                                        {device.deviceTemprs
                                                            ? device.deviceTemprs
                                                            : "No"}{" "}
                                                        device temprs associated
                                                    </ListItemLabel>
                                                </div>
                                            </ListItem>
                                        </StyledBody>
                                    </Card>
                                </div>

                                <div className="width-49 fixed-height">
                                    <Card title="Location">
                                        {device.longitude && device.latitude ? (
                                            <Map
                                                center={[
                                                    device.longitude,
                                                    device.latitude,
                                                ]}
                                                zoom={10}
                                                className="map-component"
                                            >
                                                <TileLayer
                                                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />
                                                <Marker
                                                    position={[
                                                        device.longitude,
                                                        device.latitude,
                                                    ]}
                                                ></Marker>
                                            </Map>
                                        ) : (
                                            <div className="map-component-placeholder">
                                                No location data
                                            </div>
                                        )}
                                    </Card>
                                </div>

                                <div className="width-60">
                                    {device.transmissions &&
                                    device.transmissions.length ? (
                                        <Card
                                            title={
                                                <div className="space-between">
                                                    Latest Transmissions
                                                    <Button
                                                        kind={KIND.secondary}
                                                        $as={Link}
                                                        to={`/devices/${device.id}/transmissions`}
                                                    >
                                                        View All
                                                    </Button>
                                                </div>
                                            }
                                        >
                                            <StyledBody>
                                                <Table
                                                    data={device.transmissions}
                                                    mapFunction={(
                                                        columnName,
                                                        content,
                                                    ) => {
                                                        if (
                                                            columnName ===
                                                            "success"
                                                        ) {
                                                            return content ? (
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faCheck
                                                                    }
                                                                />
                                                            ) : (
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faTimes
                                                                    }
                                                                />
                                                            );
                                                        }
                                                        return content;
                                                    }}
                                                    columns={[
                                                        {
                                                            id:
                                                                "transmissionUuid",
                                                            name:
                                                                "Transmission UUID",
                                                        },
                                                        {
                                                            id: "success",
                                                            name: "Success",
                                                        },
                                                        {
                                                            id: "transmittedAt",
                                                            name:
                                                                "Transmitted at",
                                                        },
                                                    ]}
                                                />
                                            </StyledBody>
                                            <StyledAction></StyledAction>
                                        </Card>
                                    ) : null}
                                </div>
                                <div className="width-39">
                                    <Card>
                                        <Doughnut
                                            data={{
                                                labels: ["Success", "Failure"],
                                                datasets: [
                                                    {
                                                        data: [300, 50],
                                                        backgroundColor: [
                                                            "#FF6384",
                                                            "#36A2EB",
                                                        ],
                                                        hoverBackgroundColor: [
                                                            "#FF6384",
                                                            "#36A2EB",
                                                        ],
                                                    },
                                                ],
                                            }}
                                        />
                                    </Card>
                                </div>
                            </div>
                        </>
                    );
                }}
            />
        </div>
    );
};

export { DeviceDashboard };