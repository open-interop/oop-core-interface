import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQueryParam, NumberParam, StringParam } from "use-query-params";
import { Button, KIND } from "baseui/button";
import { DataProvider, Pagination, Table } from "../Universal";
import { ErrorToast } from "../Global";
import OopCore from "../../OopCore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartPie,
    faEdit,
    faListUl,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { arrayToObject } from "../../Utilities";

const Devices = props => {
    const [devices, setDevices] = useState([]);
    const [page, setPage] = useQueryParam("page", NumberParam);
    const [pageSize, setPageSize] = useQueryParam("pageSize", NumberParam);
    const [id, setId] = useQueryParam("id", StringParam);
    const [name, setName] = useQueryParam("name", StringParam);
    const [deviceGroupId, setDeviceGroupId] = useQueryParam(
        "deviceGroupId",
        StringParam,
    );
    const [siteId, setSiteId] = useQueryParam("siteId", StringParam);

    // site selected in header overrides table filter
    if (
        props.site &&
        props.site.id &&
        (!siteId || Number(siteId) !== props.site.id)
    ) {
        setSiteId(String(props.site.id));
    }

    // reset page number when the search query is changed
    useEffect(() => {
        setPage(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize]);

    const getData = () => {
        return Promise.all([
            OopCore.getDevices({
                page,
                pageSize,
                id,
                name,
                deviceGroupId,
                siteId,
            }),
            OopCore.getDeviceGroups(),
            OopCore.getSites(),
        ]).then(([devices, groups, sites]) => {
            const groupsObject = arrayToObject(groups.data, "id");
            const sitesObject = arrayToObject(sites.data, "id");

            devices.data.forEach(device => {
                device.deviceGroupName = groupsObject[device.deviceGroupId]
                    ? groupsObject[device.deviceGroupId].name
                    : "";
                device.siteName = sitesObject[device.siteId]
                    ? sitesObject[device.siteId].name
                    : "";
            });
            setDevices(devices);
            return devices;
        });
    };
    return (
        <div className="content-wrapper">
            <div className="space-between">
                <h2>Devices</h2>
                <Button
                    $as={Link}
                    to={`/devices/new${
                        deviceGroupId ? "?deviceGroupId=" + deviceGroupId : ""
                    }`}
                    kind={KIND.minimal}
                    aria-label="Create new device"
                    endEnhancer={() => <FontAwesomeIcon icon={faPlus} />}
                >
                    New
                </Button>
            </div>
            <DataProvider
                getData={() => getData()}
                renderKey={props.location.search}
                renderData={() => (
                    <>
                        <Table
                            data={devices.data}
                            mapFunction={(columnName, content) => {
                                if (columnName === "action") {
                                    return (
                                        <>
                                            <Button
                                                $as={Link}
                                                kind={KIND.minimal}
                                                to={`/devices/${content}`}
                                                aria-label="View device dashboard"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faChartPie}
                                                />
                                            </Button>
                                            <Button
                                                $as={Link}
                                                kind={KIND.minimal}
                                                to={`/devices/${content}/edit`}
                                                aria-label="Edit device"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faEdit}
                                                />
                                            </Button>
                                            <Button
                                                $as={Link}
                                                kind={KIND.minimal}
                                                to={`/devices/${content}/transmissions`}
                                                aria-label="View device transmissions"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faListUl}
                                                />
                                            </Button>
                                        </>
                                    );
                                } else {
                                    return content;
                                }
                            }}
                            columns={[
                                {
                                    id: "id",
                                    name: "ID",
                                    type: "text",
                                    hasFilter: true,
                                    width: "50px",
                                },
                                {
                                    id: "name",
                                    name: "Name",
                                    type: "text",
                                    hasFilter: true,
                                },

                                {
                                    id: "deviceGroupName",
                                    name: "Group",
                                },
                                {
                                    id: "deviceGroupId",
                                    name: "Group ID",
                                    type: "text",
                                    hasFilter: true,
                                    width: "100px",
                                },

                                {
                                    id: "siteName",
                                    name: "Site",
                                },
                                {
                                    id: "siteId",
                                    name: "Site ID",
                                    type: "text",
                                    hasFilter: true,
                                    width: "100px",
                                },
                                { id: "action", name: "", width: "150px" },
                            ]}
                            columnContent={columnName => {
                                if (columnName === "action") {
                                    return "id";
                                }
                                return columnName;
                            }}
                            filters={{ deviceGroupId, id, name, siteId }}
                            updateFilters={(key, value) => {
                                switch (key) {
                                    case "deviceGroupId":
                                        return setDeviceGroupId(value);
                                    case "id":
                                        return setId(value);
                                    case "name":
                                        return setName(value);
                                    case "siteId":
                                        if (!props.site || !props.site.id) {
                                            return setSiteId(value);
                                        } else {
                                            return ErrorToast(
                                                "Please disable global site filtering (header) to allow table filter",
                                                "Site selection",
                                            );
                                        }

                                    default:
                                        return null;
                                }
                            }}
                        />
                        <Pagination
                            updatePageSize={pageSize => {
                                setPageSize(pageSize);
                            }}
                            currentPageSize={pageSize}
                            updatePageNumber={pageNumber => setPage(pageNumber)}
                            totalRecords={devices.totalRecords}
                            numberOfPages={devices.numberOfPages}
                            currentPage={page || 1}
                        />
                    </>
                )}
            />
        </div>
    );
};

export { Devices };
