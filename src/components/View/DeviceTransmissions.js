import React, { useState } from "react";
import { Button } from "baseui/button";
import { Pagination } from "baseui/pagination";
import { Select } from "baseui/select";
import { DataProvider } from "../Universal";
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
            if (parameters[parameterType]) {
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
                                return content;
                            }}
                            columns={[
                                { id: "id", name: "Id", hasFilter: false },
                                {
                                    id: "device_tempr_id",
                                    name: "Device Tempr Id",
                                    hasFilter: true,
                                },
                                {
                                    id: "transmission_uuid",
                                    name: "Transmission UUID",
                                    hasFilter: false,
                                },
                                {
                                    id: "message_uuid",
                                    name: "Message UUID",
                                    hasFilter: true,
                                },
                                {
                                    id: "status",
                                    name: "Status",
                                    hasFilter: true,
                                },
                                {
                                    id: "action",
                                    name: "Action",
                                    hasFilter: false,
                                },
                            ]}
                            filters={filters}
                            updateFilters={updateQueryParameters}
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
                                {Object.keys(filters).length && " filtered"}
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
