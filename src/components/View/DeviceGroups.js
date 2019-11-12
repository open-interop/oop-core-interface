import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import Show from "baseui/icon/show";
import { useQueryParam, NumberParam, StringParam } from "use-query-params";
import { DataProvider, Pagination, Table } from "../Universal";
import OopCore from "../../OopCore";

const DeviceGroups = props => {
    const [deviceGroups, setDeviceGroups] = useState([]);
    const [page, setPage] = useQueryParam("page", NumberParam);
    const [pageSize, setPageSize] = useQueryParam("pageSize", NumberParam);
    const [id, setId] = useQueryParam("id", StringParam);
    const [name, setName] = useQueryParam("name", StringParam);

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
                    return OopCore.getDeviceGroups({
                        page,
                        pageSize,
                        id,
                        name,
                    }).then(response => {
                        setDeviceGroups(response);
                        return response;
                    });
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
                                                to={`/temprs?deviceGroupId=${content}`}
                                            >
                                                View temprs
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
                                    id: "action",
                                    name: "",
                                    type: "action",
                                    hasFilter: false,
                                },
                            ]}
                            filters={{ id, name }}
                            updateFilters={(key, value) => {
                                switch (key) {
                                    case "id":
                                        return setId(value);
                                    case "name":
                                        return setName(value);
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
