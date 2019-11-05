import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQueryParam, NumberParam, StringParam } from "use-query-params";
import Show from "baseui/icon/show";
import Menu from "baseui/icon/menu";
import { Button } from "baseui/button";
import { DataProvider, Pagination, Table } from "../Universal";
import OopCore from "../../OopCore";

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
        ]).then(([devices, groups]) => {
            devices.data.forEach(device => {
                return (device.deviceGroupName =
                    groups.data.find(group => group.id === device.deviceGroupId)
                        .name || "");
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
                                            <Link to={`/devices/${content}`}>
                                                <Show />
                                            </Link>
                                            <Link
                                                to={`/devices/${content}/transmissions`}
                                            >
                                                <Menu />
                                            </Link>
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
                                },
                                {
                                    id: "name",
                                    name: "Name",
                                    type: "text",
                                    hasFilter: true,
                                },
                                {
                                    id: "deviceGroupId",
                                    name: "Group ID",
                                    type: "text",
                                    hasFilter: true,
                                },
                                {
                                    id: "deviceGroupName",
                                    name: "Group",
                                },
                                {
                                    id: "siteId",
                                    name: "Site",
                                    type: "text",
                                    hasFilter: true,
                                },
                                { id: "action", name: "Action" },
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
                                        return setSiteId(value);
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
