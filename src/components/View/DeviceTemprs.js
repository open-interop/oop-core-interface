import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryParam, NumberParam, StringParam } from "use-query-params";
import { Button } from "baseui/button";
import { Select } from "baseui/select";
import { DataProvider, Pagination, Table } from "../Universal";
import OopCore from "../../OopCore";

const DeviceTemprs = props => {
    const [groupId, setGroupId] = useState(
        Number(props.match.params.deviceGroupId),
    );
    const [groups, setGroups] = useState([]);
    const [deviceTemprs, setDeviceTemprs] = useState([]);
    const [deviceId, setDeviceId] = useQueryParam("deviceId", StringParam);
    const [temprId, setTemprId] = useQueryParam("temprId", StringParam);
    const [page, setPage] = useQueryParam("page", NumberParam);
    const [pageSize, setPageSize] = useQueryParam("pageSize", NumberParam);

    const getTableData = (deviceTemprs, devices, temprs) => {
        deviceTemprs.data.forEach(row => {
            row.tempr = temprs.some(tempr => tempr.id === row.temprId)
                ? temprs.find(tempr => tempr.id === row.temprId).name
                : "";
            row.device = devices.some(device => device.id === row.deviceId)
                ? devices.find(device => device.id === row.deviceId).name
                : "";
        });
        return deviceTemprs;
    };

    const getData = () => {
        return Promise.all([
            OopCore.getDeviceTemprs(groupId, { deviceId, temprId }),
            OopCore.getDevices(),
            OopCore.getDeviceGroups(),
            OopCore.getTemprs(groupId),
        ]).then(([deviceTemprs, devices, groups, temprs]) => {
            setDeviceTemprs(deviceTemprs);
            setGroups(groups.data);
            devices.data = devices.data.filter(
                device => device.deviceGroupId === groupId,
            );
            return getTableData(deviceTemprs, devices.data, temprs.data);
        });
    };

    return (
        <div className="content-wrapper">
            <Select
                options={groups}
                labelKey="name"
                valueKey="id"
                searchable={false}
                onChange={item => {
                    setGroupId(item.option.id);
                    props.history.replace(
                        `/device-groups/${item.option.id}/device-temprs/`,
                    );
                }}
                value={groups.find(group => group.id === groupId)}
            />

            <div className="space-between">
                <h2>Device Temprs</h2>
                <Button
                    $as={Link}
                    to={`/device-groups/${groupId}/device-temprs/new`}
                >
                    New
                </Button>
            </div>

            <DataProvider
                renderKey={
                    props.match.params.deviceGroupId + props.location.search
                }
                getData={() => {
                    return getData();
                }}
                renderData={() => (
                    <>
                        <Table
                            data={deviceTemprs.data}
                            mapFunction={(columnName, content) => {
                                if (columnName === "action") {
                                    return (
                                        <Button
                                            $as={Link}
                                            to={`/device-groups/${props.match.params.deviceGroupId}/device-temprs/${content}`}
                                        >
                                            View
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
                                    id: "deviceId",
                                    name: "Device Id",
                                    type: "text",
                                    hasFilter: true,
                                },
                                {
                                    id: "device",
                                    name: "Device",
                                    type: "text",
                                    hasFilter: false,
                                },
                                {
                                    id: "temprId",
                                    name: "Tempr Id",
                                    type: "text",
                                    hasFilter: true,
                                },
                                {
                                    id: "tempr",
                                    name: "Tempr",
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
                            filters={{
                                deviceId,
                                temprId,
                            }}
                            updateFilters={(key, value) => {
                                switch (key) {
                                    case "deviceId":
                                        return setDeviceId(value);
                                    case "temprId":
                                        return setTemprId(value);
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
                            totalRecords={deviceTemprs.totalRecords}
                            numberOfPages={deviceTemprs.numberOfPages}
                            currentPage={page || 1}
                        />
                    </>
                )}
            />
        </div>
    );
};

export { DeviceTemprs };
