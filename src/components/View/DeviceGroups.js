import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { DataProvider, Table } from "../Universal";
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
                        <Table
                            data={deviceGroups}
                            mapFunction={(columnName, content) => {
                                if (columnName === "action") {
                                    return (
                                        <Button
                                            $as={Link}
                                            to={`${props.location.pathname}/${content}/temprs`}
                                        >
                                            View temprs
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
