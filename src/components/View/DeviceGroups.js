import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import Show from "baseui/icon/show";
import { useQueryParam, NumberParam } from "use-query-params";
import { DataProvider, Pagination, Table } from "../Universal";
import OopCore from "../../OopCore";

const DeviceGroups = props => {
    const [deviceGroups, setDeviceGroups] = useState([]);
    const [page, setPage] = useQueryParam("page", NumberParam);
    const [pageSize, setPageSize] = useQueryParam("pageSize", NumberParam);
    const [id, setId] = useQueryParam("id", NumberParam);

    // reset page number when the search query is changed
    useEffect(() => {
        setPage(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, id]);

    return (
        <div className="content-wrapper">
            <div className="space-between">
                <h2>Device Groups</h2>
                <Button $as={Link} to={`/device-groups/new`}>
                    New
                </Button>
            </div>

            <DataProvider
                getData={() => {
                    return OopCore.getDeviceGroups({ page, pageSize }).then(
                        response => {
                            setDeviceGroups(response);
                            return response;
                        },
                    );
                }}
                renderKey={props.location.search}
                renderData={() => (
                    <>
                        <Table
                            data={deviceGroups.data}
                            mapFunction={(columnName, content) => {
                                if (columnName === "action") {
                                    return (
                                        <>
                                            <Link
                                                to={`/device-groups/${content}`}
                                            >
                                                <Show />
                                            </Link>
                                            <Button
                                                $as={Link}
                                                to={`devices?deviceGroupId=${content}`}
                                            >
                                                Devices
                                            </Button>
                                            <Button
                                                $as={Link}
                                                to={`${props.location.pathname}/${content}/temprs`}
                                            >
                                                View temprs
                                            </Button>
                                            <Button
                                                $as={Link}
                                                to={`/device-groups/${content}/device-temprs?deviceId=${content}`}
                                            >
                                                Device Temprs
                                            </Button>
                                        </>
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
                                    id: "id",
                                    name: "Id",
                                    type: "text",
                                    hasFilter: false,
                                },
                                {
                                    id: "name",
                                    name: "Name",
                                    type: "text",
                                    hasFilter: false,
                                },
                                {
                                    id: "action",
                                    name: "Action",
                                    type: "action",
                                    hasFilter: false,
                                },
                            ]}
                            filters={{ id }}
                            updateFilters={(key, value) => {
                                switch (key) {
                                    case "id":
                                        return setId(value);
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
                            totalRecords={deviceGroups.totalRecords}
                            numberOfPages={deviceGroups.numberOfPages}
                            currentPage={page || 1}
                        />
                    </>
                )}
            />
        </div>
    );
};

export { DeviceGroups };
