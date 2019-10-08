import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { useQueryParam, NumberParam } from "use-query-params";
import { DataProvider, Pagination, Table } from "../Universal";
import OopCore from "../../OopCore";

const DeviceGroups = props => {
    const [deviceGroups, setDeviceGroups] = useState([]);
    const [page, setPage] = useQueryParam("page", NumberParam);
    const [pageSize, setPageSize] = useQueryParam("pageSize", NumberParam);
    const [id, setId] = useQueryParam("filters", NumberParam);

    // reset page number when the search query is changed
    useEffect(() => {
        setPage(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, id]);

    return (
        <div className="content-wrapper">
            <h2>Device Groups</h2>
            <DataProvider
                getData={() => {
                    return OopCore.getDeviceGroups().then(response => {
                        setDeviceGroups(response);
                        return response;
                    });
                }}
                renderData={() => (
                    <>
                        <Table
                            data={deviceGroups.data}
                            mapFunction={(columnName, content) => {
                                if (columnName === "action") {
                                    return (
                                        <Button
                                            $as={Link}
                                            to={`${props.location.pathname}/${content}/temprs`}
                                        >
                                            View temprs
                                        </Button>
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
