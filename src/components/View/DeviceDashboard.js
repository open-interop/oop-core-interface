import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useStyletron } from "baseui";
import { Button, KIND } from "baseui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircle,
    faCheck,
    faEdit,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Table, Page, MaxCard, InPlaceGifSpinner } from "../Universal";
import { ListItem, ListItemLabel } from "baseui/list";
import { Map, TileLayer, Marker } from "react-leaflet";
import { Chart, Pie } from "react-chartjs-2";
import styles from "./../../styles/_variables.scss";
import OopCore from "../../OopCore";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";

const Waiting = props => {
    return (
        <MaxCard title={props.title}>
            <InPlaceGifSpinner />
        </MaxCard>
    );
};

const StatusIndicator = props => {
    const device = props.device;

    const [css, theme] = useStyletron();
    
    console.log(theme);

    const active = css({
        float: "right",
        color: theme.colors.positive,
        fontSize: "smaller",
        ":after": { content: '" ACTIVE"' },
    });

    const inactive = css({
        float: "right",
        color: theme.colors.negative,
        fontSize: "smaller",
        ":after": { content: '" INACTIVE"' },
    });

    return (
        <span className={device.active ? active : inactive}>
            <FontAwesomeIcon
                className={device.active ? "blink" : ""}
                icon={faCircle}
            />
        </span>
    );
};

const DeviceDetails = props => {
    const { device } = props;

    if (!(device && device.group)) {
        return <Waiting title="Details" />;
    }

    return (
        <MaxCard
            title={
                <>
                    Details <StatusIndicator device={device} />
                </>
            }
        >
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
                        {
                            device.site
                                ? device.site.fullName
                                : ""
                        }
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
                        {
                            device.deviceTemprs
                                ? device.deviceTemprs
                                : "No"
                        }{" "}
                        device temprs associated
                    </ListItemLabel>
                </div>
            </ListItem>
        </MaxCard>
    );
};

const DeviceLocation = props => {
    const { device } = props;

    if (device === null) {
        return <Waiting title="Location" />;
    }

    return (
        <MaxCard title="Location">
            {device.longitude && device.latitude ? (
                <Map
                    center={[
                        device.latitude,
                        device.longitude,
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
                            device.latitude,
                            device.longitude,
                        ]}
                    ></Marker>
                </Map>
            ) : (
                <div className="map-component-placeholder">
                    No location data
                </div>
            )}
        </MaxCard>
    );
};

const DeviceTransmissions = props => {
    const { device } = props;

    if (device === null) {
        return <Waiting title="Latest Transmissions" />;
    }

    if (!(device.transmissions && device.transmissions.length)) {
        return (
            <MaxCard title="Latest Transmissions">
                No transmissions available
            </MaxCard>
        );
    }

    return (
        <MaxCard
            title={
                <>
                    Latest Transmissions
                    <Button
                        kind={KIND.secondary}
                        $as={Link}
                        to={`/devices/${device.id}/transmissions`}
                        $style={{ float: "right" }}
                    >
                        View All
                    </Button>
                </>
            }
        >
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
        </MaxCard>
    );
};

const DeviceTransmissionStatus = props => {
    const { device } = props;

    if (device === null) {
        return <Waiting title="Transmission Status" />;
    }

    if (!(device.transmissions && device.transmissions.length)) {
        return (
            <MaxCard title="Transmission Status">
                No transmission status available
            </MaxCard>
        );
    }

    const generateCustomLabels = chart => {
        var data = chart.data;

        if (data.labels.length && data.datasets.length) {
            return data.labels.map(function(label, i) {
                var meta = chart.getDatasetMeta(0);
                var ds = data.datasets[0];
                var arc = meta.data[i];
                var custom = (arc && arc.custom) || {};
                var getValueAtIndexOrDefault =
                    Chart.helpers.getValueAtIndexOrDefault;
                var arcOpts = chart.options.elements.arc;
                var fill = custom.backgroundColor
                    ? custom.backgroundColor
                    : getValueAtIndexOrDefault(
                          ds.backgroundColor,
                          i,
                          arcOpts.backgroundColor,
                      );
                var stroke = custom.borderColor
                    ? custom.borderColor
                    : getValueAtIndexOrDefault(
                          ds.borderColor,
                          i,
                          arcOpts.borderColor,
                      );
                var bw = custom.borderWidth
                    ? custom.borderWidth
                    : getValueAtIndexOrDefault(
                          ds.borderWidth,
                          i,
                          arcOpts.borderWidth,
                      );
                return {
                    text: ds.data[i] + " " + label.toLowerCase(),
                    fillStyle: fill,
                    strokeStyle: stroke,
                    lineWidth: bw,
                    hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                    index: i,
                };
            });
        }
        return [];
    };

    return (
        <MaxCard title="Transmission Status">
            <div className="flex-row center">
                <Pie
                    data={{
                        labels: device.stats.map(
                            stat => stat.label,
                        ),
                        datasets: [
                            {
                                data: device.stats.map(
                                    stat =>
                                        stat.value,
                                ),
                                backgroundColor: device.stats.map(
                                    stat =>
                                        stat.backgroundColor,
                                ),
                            },
                        ],
                    }}
                    options={{
                        legend: {
                            position: "right",
                            labels: {
                                generateLabels: generateCustomLabels,
                            },
                        },
                    }}
                />
            </div>
        </MaxCard>
    );
};

const DeviceDashboard = props => {
    const deviceId = props.match.params.deviceId;
    const [device, setDevice] = useState(null);
    const allDevicesPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    useEffect(() => {
        Promise.all([
            OopCore.getDevice(deviceId),
            OopCore.getTransmissions(deviceId, {
                pageSize: 5,
            }),
            OopCore.getDeviceTemprs({
                deviceId: deviceId,
                pageSize: -1,
            }),
            OopCore.getTransmissionStats({
                deviceId: deviceId,
                group: "success",
            }),
        ])
            .then(([
                device,
                transmissions,
                deviceTemprs,
                deviceStats,
            ]) => {
                device.transmissions = transmissions.data;
                device.deviceTemprs = deviceTemprs.data.length;

                const successfulTransmissions = {
                    label: "Successful",
                    value: deviceStats.transmissions.true || 0,
                    backgroundColor: styles.green,
                };
                const failedTransmissions = {
                    label: "Failed",
                    value: deviceStats.transmissions.false || 0,
                    backgroundColor: styles.red,
                };

                device.stats = [successfulTransmissions, failedTransmissions];

                setDevice(device);

                Promise.all([
                    OopCore.getSite(device.siteId),
                    OopCore.getDeviceGroup(device.deviceGroupId),
                ])
                    .then(([site, group]) => {
                        setDevice({ ...device, site, group });
                    });
            });
    }, [deviceId]);

    return (
        <Page
            title="Device Dashboard | Open Interop"
            heading="Device Dashboard"
            backlink={allDevicesPath}
            actions={
                <Button
                    $as={Link}
                    kind={KIND.minimal}
                    to={`/devices/${props.match.params.deviceId}/edit`}
                    endEnhancer={() => <FontAwesomeIcon icon={faEdit} />}
                    aria-label="Edit this device"
                >
                    Edit
                </Button>
            }
        >
            <Grid behavior={BEHAVIOR.fluid} gridGaps={[32]} >
                <Cell span={5}>
                    <DeviceDetails device={device} />
                </Cell>
                <Cell span={7}>
                    <DeviceLocation device={device} />
                </Cell>
                <Cell span={7}>
                    <DeviceTransmissions device={device} />
                </Cell>
                <Cell span={5}>
                    <DeviceTransmissionStatus device={device} />
                </Cell>
            </Grid>
        </Page>
    );
};

export { DeviceDashboard };
