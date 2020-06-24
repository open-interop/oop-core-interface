import React, { useState } from "react";

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
    BaseuiSpinner,
    DataProvider,
    IconSpinner,
    Pagination,
    Table,
} from "../Universal";

import OopCore from "../../OopCore";

const DeviceAssociator = props => {
    const [devicesPage, setDevicesPage] = useState(1);
    const [devicesPageSize, setDevicesPageSize] = useState(10);
    const [deviceFilterId, setDeviceFilterId] = useState("");
    const [deviceFilterName, setDeviceFilterName] = useState("");
    const [deviceFilterSite, setDeviceFilterSite] = useState("");
    const [deviceFilterSelected, setDeviceFilterSelected] = useState("");
    const [deviceTemprLoading, setDeviceTemprLoading] = useState(false);

    const selected = {};

    for (const deviceTempr of props.selected) {
        selected[deviceTempr.deviceId] = deviceTempr;
    }

    console.log(selected);

    const renderDeviceAssociations = devices => {
        return (
            <>
                <Table
                    data={devices.data}
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
                    filters={{
                        id: deviceFilterId,
                        name: deviceFilterName,
                        siteId: deviceFilterSite,
                        selected: deviceFilterSelected,
                    }}
                    updateFilters={(key, value) => {
                        switch (key) {
                            case "id":
                                return setDeviceFilterId(value);
                            case "name":
                                return setDeviceFilterName(value);
                            case "siteId":
                                return setDeviceFilterSite(value);
                            case "selected":
                                if (value === null) {
                                    return setDeviceFilterSelected("");
                                }
                                return setDeviceFilterSelected(value);
                            default:
                                return null;
                        }
                    }}
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
                <Pagination
                    updatePageSize={pageSize => {
                        setDevicesPageSize(pageSize);
                    }}
                    currentPageSize={devicesPageSize}
                    updatePageNumber={pageNumber => setDevicesPage(pageNumber)}
                    totalRecords={devices.totalRecords}
                    numberOfPages={devices.numberOfPages}
                    currentPage={devicesPage || 1}
                />
            </>
        );
    };

    return <AccordionWithCaption
        title="Device Associations "
        subtitle="Select devices to associate with this tempr"
        error={props.error}
        startOpen
    >
    <DataProvider
        getData={() => {
            return Promise.all([
                OopCore.getSites({ pageSize: -1 }),
                OopCore.getDevices({
                    //deviceGroupId: updatedTempr.deviceGroupId,
                    pageSize: devicesPageSize,
                    page: devicesPage,
                    id: deviceFilterId,
                    name: deviceFilterName,
                    siteId: deviceFilterSite,
                }),
            ])
                .then(([sites, devices]) => {
                    const sitesById = {};
                    for (const s of sites.data) {
                        sitesById[s.id] = s;
                    }

                    for (const d of devices.data) {
                        d.siteName = sitesById[d.siteId].name;
                    }

                    return devices;
                });
        }}
        renderKey={
            devicesPage +
                devicesPageSize +
                deviceFilterId +
                deviceFilterName +
                deviceFilterSite +
                deviceFilterSelected
        }
        renderData={renderDeviceAssociations}
    />
    </AccordionWithCaption>
    ;
};

export default DeviceAssociator;
