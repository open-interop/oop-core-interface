import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { DataProvider, Pagination, Table } from "../Universal";
import Check from "baseui/icon/check";
import Delete from "baseui/icon/delete";
import OopCore from "../../OopCore";

const queryString = require("query-string");

const pageSizeOptions = [
    { id: "10" },
    { id: "20" },
    { id: "40" },
    { id: "60" },
    { id: "80" },
    { id: "100" },
];

const Transmissions = props => {
    const [transmissions, setTransmissions] = useState(null);
    const [queryParameters, setQueryParameters] = useState(
        queryString.parse(props.location.search),
    );

    const getPageSize = () => {
        return (
            pageSizeOptions.find(
                option => option.id === queryParameters.pageSize,
            ) || {
                id: "10",
            }
        );
    };

    const updateQueryParameters = parameters => {
        const newParameters = { ...queryParameters };

        Object.keys(parameters).forEach(parameterType => {
            if (
                parameters[parameterType] !== null &&
                parameters[parameterType] !== ""
            ) {
                newParameters[parameterType] = parameters[parameterType];
            } else {
                delete newParameters[parameterType];
            }
        });

        setQueryParameters(newParameters);
        props.history.push({
            search: queryString.stringify(newParameters),
        });
    };

    const updateTableFilters = parameters => {
        parameters.page = null;
        updateQueryParameters(parameters);
    };

    const { page, pageSize, ...filters } = queryParameters;

    return (
        <div className="content-wrapper">
            <h2>Transmissions - Device {props.match.params.deviceId}</h2>
            <DataProvider
                getData={() => {
                    return OopCore.getTransmissions(
                        props.match.params.deviceId,
                        queryString.parse(props.location.search),
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
                            updateFilters={updateTableFilters}
                        />
                        <Pagination
                            pageSizeOptions={pageSizeOptions}
                            updatePagination={pagination =>
                                updateQueryParameters(pagination)
                            }
                            currentPageSize={getPageSize()}
                            totalRecords={transmissions.totalRecords}
                            numberOfPages={transmissions.numberOfPages}
                            currentPage={Number(queryParameters.page) || 1}
                        />
                    </>
                )}
                renderKey={props.location.search}
            />
        </div>
    );
};

export { Transmissions };
