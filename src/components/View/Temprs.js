import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { useQueryParam, NumberParam, JsonParam } from "use-query-params";
import { DataProvider, Pagination, Table } from "../Universal";
import OopCore from "../../OopCore";

const Temprs = props => {
    const [temprs, setTemprs] = useState([]);
    const [page, setPage] = useQueryParam("page", NumberParam);
    const [pageSize, setPageSize] = useQueryParam("pageSize", NumberParam);
    const [filters, setFilters] = useQueryParam("filters", JsonParam);

    // reset page number when the search query is changed
    useEffect(() => {
        setPage(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, filters]);

    const getData = () => {
        return Promise.all([
            OopCore.getTemprs(props.match.params.deviceGroupId),
            OopCore.getDeviceGroups(),
        ]).then(([temprs, groups]) => {
            temprs.data = temprs.data.map(tempr => ({
                ...tempr,
                group: groups.data.some(
                    group => group.id === tempr.deviceGroupId,
                )
                    ? groups.data.find(
                          group => group.id === tempr.deviceGroupId,
                      ).name
                    : "No group name provided",
            }));
            return temprs;
        });
    };

    return (
        <div className="content-wrapper">
            <div className="space-between">
                <h2>Temprs</h2>
                <Button $as={Link} to={`${props.location.pathname}/new`}>
                    New tempr
                </Button>
            </div>
            <DataProvider
                getData={() => {
                    return getData().then(response => {
                        setTemprs(response);
                        return response;
                    });
                }}
                renderData={() => (
                    <>
                        <Table
                            data={temprs.data}
                            mapFunction={(columnName, content) => {
                                if (columnName === "action") {
                                    return (
                                        <Button
                                            $as={Link}
                                            to={`${props.location.pathname}/${content}`}
                                        >
                                            Edit
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
                                    id: "name",
                                    name: "Name",
                                    type: "text",
                                    hasFilter: true,
                                },
                                {
                                    id: "group",
                                    name: "Group",
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
                            updatePageSize={pageSize => {
                                setPageSize(pageSize);
                            }}
                            currentPageSize={pageSize}
                            updatePageNumber={pageNumber => setPage(pageNumber)}
                            totalRecords={temprs.totalRecords}
                            numberOfPages={temprs.numberOfPages}
                            currentPage={page || 1}
                        />
                    </>
                )}
            />
        </div>
    );
};

export { Temprs };
