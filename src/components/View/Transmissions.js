import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { DataProvider, Pagination, Table } from "../Universal";
import { useQueryParam, NumberParam, JsonParam } from "use-query-params";

import Check from "baseui/icon/check";
import Delete from "baseui/icon/delete";
import OopCore from "../../OopCore";

const pageSizeOptions = [
    { id: 10 },
    { id: 20 },
    { id: 40 },
    { id: 60 },
    { id: 80 },
    { id: 100 },
];

const Transmissions = props => {
    const [transmissions, setTransmissions] = useState(null);
    const [page, setPage] = useQueryParam("page", NumberParam);
    const [pageSize, setPageSize] = useQueryParam("pageSize", NumberParam);
    const [filters, setFilters] = useQueryParam("filters", JsonParam);

    // reset page number when the search query is changed
    useEffect(() => {
        setPage(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, filters]);

    return (
        <div className="content-wrapper">
            <h2>Transmissions - Device {props.match.params.deviceId}</h2>
            <DataProvider
                getData={() => {
                    return OopCore.getTransmissions(
                        props.match.params.deviceId,
                        { page, pageSize, filters },
                    ).then(response => {
                        setTransmissions(response);
                        return response;
                    });
                }}
                renderData={() => (
                    <>
                        <Table
                            data={transmissions.data}
                            mapFunction={(columnName, content) => {
                                if (columnName === "action") {
                                    return (
                                        <Button
                                            $as={Link}
                                            to={`${props.location.pathname}
                                            /${content}`}
                                        >
                                            {content}
                                        </Button>
                                    );
                                }

                                if (columnName === "success") {
                                    return content ? <Check /> : <Delete />;
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
                                    id: "device_tempr_id",
                                    name: "Device Tempr Id",
                                    type: "text",
                                    hasFilter: true,
                                },
                                {
                                    id: "transmissionUuid",
                                    name: "Transmission UUID",
                                    type: "text",
                                    hasFilter: true,
                                },
                                {
                                    id: "messageUuid",
                                    name: "Message UUID",
                                    type: "text",
                                    hasFilter: true,
                                },
                                {
                                    id: "status",
                                    name: "Status",
                                    type: "text",
                                    hasFilter: true,
                                },
                                {
                                    id: "success",
                                    name: "Success",
                                    type: "bool",
                                    hasFilter: true,
                                },
                                {
                                    id: "action",
                                    name: "Action",
                                    type: "action",
                                    hasFilter: false,
                                },
                            ]}
                            filters={filters}
                            updateFilters={(key, value) => {
                                const updatedFilters = { ...filters };
                                if (value) {
                                    updatedFilters[key] = value;
                                } else {
                                    delete updatedFilters[key];
                                }
                                setFilters(
                                    Object.keys(updatedFilters).length
                                        ? updatedFilters
                                        : null,
                                );
                            }}
                        />
                        <Pagination
                            pageSizeOptions={pageSizeOptions}
                            updatePageSize={pageSize => {
                                setPageSize(pageSize);
                            }}
                            currentPageSize={
                                pageSizeOptions.find(
                                    option => option.id === pageSize,
                                ) || {
                                    id: 10,
                                }
                            }
                            updatePageNumber={pageNumber => setPage(pageNumber)}
                            totalRecords={transmissions.totalRecords}
                            numberOfPages={transmissions.numberOfPages}
                            currentPage={page || 1}
                        />
                    </>
                )}
                renderKey={props.location.search}
            />
        </div>
    );
};

export { Transmissions };
