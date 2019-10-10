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
    const [devices, setDevices] = useState([]);
    const [temprs, setTemprs] = useState([]);
    const [associations, setAssociations] = useState([]);
    const [deviceId, setDeviceId] = useQueryParam("deviceId", StringParam);
    const [temprId, setTemprId] = useQueryParam("temprId", StringParam);
    const [page, setPage] = useQueryParam("page", NumberParam);
    const [pageSize, setPageSize] = useQueryParam("pageSize", NumberParam);
    const getTableData = (associations, devices, groups, temprs) => {
        associations.data.forEach(row => {
            row.tempr = temprs.find(tempr => tempr.id === row.temprId).name;
            row.device = devices.find(
                device => device.id === row.deviceId,
            ).name;
        });
        return associations;
    };

    const getData = () => {
        return Promise.all([
            OopCore.getDeviceTemprs(groupId, { deviceId, temprId }),
            OopCore.getDevices(),
            OopCore.getDeviceGroups(),
            OopCore.getTemprs(groupId),
        ]).then(([associations, devices, groups, temprs]) => {
            setAssociations(associations);
            setDevices(devices.data);
            setGroups(groups.data);
            setTemprs(temprs.data);
            return getTableData(
                associations,
                devices.data,
                groups.data,
                temprs.data,
            );
        });
    };

    return (
        <div className="content-wrapper">
            <h2>
                Device Tempr Associations
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
            </h2>
            <DataProvider
                renderKey={
                    props.match.params.deviceGroupId + props.location.search
                }
                getData={() => {
                    return getData().then(response => {
                        setAssociations(response);
                        return response;
                    });
                }}
                renderData={() => (
                    <>
                        <Table
                            data={associations.data}
                            mapFunction={(columnName, content) => {
                                if (columnName === "action") {
                                    return (
                                        <Button
                                            $as={Link}
                                            to={`${props.location.pathname}/${content}`}
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
                        {
                            <Pagination
                                updatePageSize={pageSize => {
                                    setPageSize(pageSize);
                                }}
                                currentPageSize={pageSize}
                                updatePageNumber={pageNumber =>
                                    setPage(pageNumber)
                                }
                                totalRecords={temprs.totalRecords}
                                numberOfPages={temprs.numberOfPages}
                                currentPage={page || 1}
                            />
                        }
                    </>
                )}
            />
        </div>
    );
};

export { DeviceTemprs };
