import React, { useState } from "react";
import { Button } from "baseui/button";
import { DataProvider } from "../Universal";
import { SortableTable } from "../Global";
import OopCore from "../../OopCore";

const DeviceGroups = props => {
    const [deviceGroups, setDeviceGroups] = useState([]);
    return (
        <div className="content-wrapper">
            <h2>Device Groups</h2>
            <DataProvider
                getData={() => {
                    return OopCore.getDeviceGroups().then(response => {
                        setDeviceGroups(response.data);
                        return response;
                    });
                }}
                renderData={() => (
                    <>
                        <SortableTable
                            data={deviceGroups}
                            mapFunction={(columnName, content) => {
                                if (columnName === "action") {
                                    return (
                                        <Button
                                            onClick={() =>
                                                props.history.push(
                                                    props.location.pathname +
                                                        `/${content}/temprs`,
                                                )
                                            }
                                        >
                                            view temprs
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
                        />
                    </>
                )}
            />
        </div>
    );
};

export { DeviceGroups };
