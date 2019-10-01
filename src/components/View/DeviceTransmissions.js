import React, { useState } from "react";
import { Button } from "baseui/button";
import { Pagination } from "baseui/pagination";
import { Select } from "baseui/select";
import { DataProvider } from "../Universal";
import Check from "baseui/icon/check";
import Delete from "baseui/icon/delete";
import { SortableTable } from "../Global";
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

const DeviceTransmissions = props => {
    const [transmissions, setTransmissions] = useState(null);
    const [queryParameters, setQueryParameters] = useState(
        queryString.parse(props.location.search),
    );

    const getPageSizeOption = () => {
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
        <div className="device-transmissions">
            <h2>Transmissions - Device {props.match.params.deviceId}</h2>
            <DataProvider
                getData={() => {
                    return OopCore.getDeviceTransmissions(
                        props.match.params.deviceId,
                        queryString.parse(props.location.search),
                    ).then(response => {
                        setTransmissions(response);
                        return response;
                    });
                }}
                renderData={() => (
                    <>
                        <SortableTable
                            data={transmissions.data}
                            mapFunction={(columnName, content) => {
                                if (columnName === "action") {
                                    return <Button>{content}</Button>;
                                }

                                if (columnName === "success") {
                                    return content ? <Check /> : <Delete />;
                                }
                                return content;
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
                        <div className="pagination-footer">
                            <Select
                                options={pageSizeOptions}
                                labelKey="id"
                                valueKey="id"
                                searchable={false}
                                clearable={false}
                                onChange={value => {
                                    updateQueryParameters({
                                        pageSize: value.option.id,
                                        page: null,
                                    });
                                }}
                                value={getPageSizeOption()}
                            />
                            <div className="pagination-label">per page</div>
                            <div className="pagination-label">
                                {transmissions.totalRecords}
                                {Object.keys(filters).length > 0
                                    ? " filtered"
                                    : ""}
                                {transmissions.totalRecords > 1 ||
                                transmissions.totalRecords === 0
                                    ? " records"
                                    : " record"}
                            </div>
                            <Pagination
                                numPages={transmissions.numberOfPages}
                                currentPage={Number(queryParameters.page) || 1}
                                onPageChange={event => {
                                    updateQueryParameters({
                                        page: event.nextPage,
                                    });
                                }}
                            />
                        </div>
                    </>
                )}
                renderKey={props.location.search}
            />
        </div>
    );
};

export { DeviceTransmissions };
