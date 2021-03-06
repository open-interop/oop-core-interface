import React, { useState, memo } from "react";

import { Link } from "react-router-dom";
import { Button, KIND } from "baseui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faExternalLinkAlt,
    faCheck,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";

import {
    AccordionWithCaption,
    IconSpinner,
    PaginatedTable,
} from "../Universal";

import OopCore from "../../OopCore";

const DeviceAssociator = memo(props => {
    const [deviceTemprLoading, setDeviceTemprLoading] = useState(false);

    const selected = {};
    // eslint-disable-next-line no-unused-vars
    for (const deviceTempr of props.selected) {
        selected[deviceTempr.deviceId] = deviceTempr;
    }

    return (
        <AccordionWithCaption
            title="Device Associations "
            subtitle="Select devices to associate with this tempr"
            error={props.error}
            startOpen={props.startOpen || false}
        >
            <PaginatedTable
                prefix="device-"
                refresh={props.deviceGroupId}
                getData={(pagination) => {
                    return Promise.all([
                        OopCore.getSites({ "page[size]": -1 }),
                        OopCore.getDevices({
                            filter: { deviceGroupId: props.deviceGroupId },
                            pagination,
                        }),
                    ])
                    .then(([sites, devices]) => {
                        const sitesById = {};
                        // eslint-disable-next-line no-unused-vars
                        for (const s of sites.data) {
                            sitesById[s.id] = s;
                        }
                        // eslint-disable-next-line no-unused-vars
                        for (const d of devices.data) {
                            d.siteName = sitesById[d.siteId].name;
                        }

                        return devices;
                    });
                }}
                rowClassName={row =>
                    `device-tempr${row.selected ? " selected" : ""}`
                }
                mapFunction={(columnName, content, row) => {
                    if (columnName === "action") {
                        return (
                            <>
                                <Button
                                    kind={KIND.minimal}
                                    $as={Link}
                                    target="_blank"
                                    to={"/devices/" + content}
                                >
                                    <FontAwesomeIcon
                                        icon={faExternalLinkAlt}
                                    />
                                </Button>
                            </>
                        );
                    }

                    if (columnName === "selected") {
                        if (deviceTemprLoading === row.id) {
                            return <IconSpinner />;
                        }
                        return selected[row.id] ? (
                            <FontAwesomeIcon icon={faCheck} />
                        ) : (
                            <FontAwesomeIcon icon={faTimes} />
                        );
                    }

                    return content;
                }}
                columnContent={columnName => {
                    if (columnName === "action") {
                        return "id";
                    }

                    return columnName;
                }}
                columns={[
                    {
                        id: "selected",
                        name: "",
                        type: "bool",
                        hasFilter: true,
                        width: "20px",
                    },
                    {
                        id: "id",
                        name: "Id",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "name",
                        name: "Name",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "siteId",
                        name: "Site ID",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "siteName",
                        name: "Site",
                        type: "text",
                        hasFilter: false,
                    },

                    {
                        id: "action",
                        name: "",
                        type: "action",
                        hasFilter: false,
                        width: "30px",
                    },
                ]}
                trueText="Selected"
                falseText="Not selected"
                onRowClick={async (device, column) => {
                    if (column !== "action" && !deviceTemprLoading) {
                        setDeviceTemprLoading(device.id);

                        if (selected[device.id]) {
                            await props.onDeselect(device, selected[device.id]);
                        } else {
                            await props.onSelect(device);
                        }

                        setDeviceTemprLoading(false);
                    }
                }}
            />
        </AccordionWithCaption>
    );
});

export default DeviceAssociator;
