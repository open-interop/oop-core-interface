import React, { useState } from "react";
import { Button } from "baseui/button";
import { DataProvider } from "../Universal";
import { SortableTable } from "../Global";
import OopCore from "../../OopCore";

const Temprs = props => {
    const [temprs, setTemprs] = useState([]);

    const getData = () => {
        return Promise.all([
            OopCore.getTemprs(props.match.params.deviceGroupId),
            OopCore.getDeviceGroups(),
        ]).then(([temprs, groups]) => {
            const tableData = temprs.data.map(tempr => ({
                ...tempr,
                group: groups.data.some(
                    group => group.id === tempr.deviceGroupId,
                )
                    ? groups.data.find(
                          group => group.id === tempr.deviceGroupId,
                      ).name
                    : "No group name provided",
            }));
            return tableData;
        });
    };

    return (
        <div className="content-wrapper">
            <h2>Temprs</h2>
            <DataProvider
                getData={() => {
                    return getData().then(response => {
                        setTemprs(response);
                        return response;
                    });
                }}
                renderData={() => (
                    <>
                        <SortableTable
                            data={temprs}
                            mapFunction={(columnName, content) => {
                                if (columnName === "action") {
                                    return <Button>edit</Button>;
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
                        />
                    </>
                )}
            />
        </div>
    );
};

export { Temprs };
