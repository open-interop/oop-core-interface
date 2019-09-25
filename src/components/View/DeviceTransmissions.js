import React, { useState } from "react";
import { Button } from "baseui/button";
import { DataProvider, LineWrapper, SortableTable } from "../Universal";
import { Pagination } from "baseui/pagination";
import { Select } from "baseui/select";
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
    const [queryParams, setQueryParams] = useState(
        queryString.parse(props.location.search),
    );

    const getPageSizeOption = () => {
        return (
            pageSizeOptions.find(
                option => option.id === queryParams.pageSize,
            ) || {
                id: "10",
            }
        );
    };

    const updateQueryParameters = objectWithParams => {
        const newParams = { ...queryParams };
        const fieldsToUpdate = Object.keys(objectWithParams);
        fieldsToUpdate.forEach(field => {
            if (objectWithParams[field]) {
                newParams[field] = objectWithParams[field];
            } else {
                delete objectWithParams[field];
            }
        });
        setQueryParams(newParams);
        props.history.push({
            search: queryString.stringify(newParams),
        });
    };

    return (
        <div className="device-transmissions">
            <h2>Transmissions - Device {props.match.params.deviceId}</h2>
            <LineWrapper title={"Filters"}></LineWrapper>
            <DataProvider
                getData={() => {
                    return OopCore.getDeviceTransmissions(
                        props.match.params.deviceId,
                        queryString.parse(props.location.search),
                    ).then(data => {
                        setTransmissions(data);
                        return data;
                    });
                }}
                renderData={() => (
                    <SortableTable
                        data={transmissions}
                        mapFunction={(columnName, content) => {
                            if (columnName === "action") {
                                return <Button>{content}</Button>;
                            }
                            return content;
                        }}
                        columns={[
                            { id: "id", name: "Id" },
                            {
                                id: "device_tempr_id",
                                name: "Device Tempr Id",
                            },
                            {
                                id: "transmission_uuid",
                                name: "Transmission UUID",
                            },
                            { id: "message_uuid", name: "Message UUID" },
                            { id: "status", name: "Status" },
                            { id: "action", name: "Action" },
                        ]}
                    />
                )}
                renderKey={props.location.search}
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
                <div className="select-label">per page</div>
                <Pagination
                    numPages={100}
                    currentPage={queryParams.page || 1}
                    onPageChange={e => {
                        updateQueryParameters({ page: e.nextPage });
                    }}
                />
            </div>
        </div>
    );
};

export { DeviceTransmissions };
