import React, { useState } from "react";
import { Link } from "react-router-dom";
import Show from "baseui/icon/show";
import Menu from "baseui/icon/menu";
import { Button } from "baseui/button";
import { DataProvider, Table } from "../Universal";
import OopCore from "../../OopCore";

const Devices = () => {
    const [devices, setDevices] = useState([]);

    return (
        <DataProvider
            getData={() =>
                OopCore.getDevices().then(response => {
                    setDevices(response);
                    return response;
                })
            }
            renderData={() => (
                <div className="content-wrapper">
                    <div className="space-between">
                        <h2>Devices</h2>
                        <Button $as={Link} to={`/devices/new`}>
                            New
                        </Button>
                    </div>
                    <Table
                        data={devices.data}
                        mapFunction={(columnName, content) => {
                            if (columnName === "action") {
                                return (
                                    <>
                                        <Link to={`/devices/${content}`}>
                                            <Show />
                                        </Link>
                                        <Link
                                            to={`/devices/${content}/transmissions`}
                                        >
                                            <Menu />
                                        </Link>
                                    </>
                                );
                            } else {
                                return content;
                            }
                        }}
                        columns={[
                            { id: "id", name: "ID" },
                            { id: "name", name: "Name" },
                            { id: "deviceGroupId", name: "Group" },
                            { id: "siteId", name: "Site" },
                            { id: "action", name: "Action" },
                        ]}
                        columnContent={columnName => {
                            if (columnName === "action") {
                                return "id";
                            }
                            return columnName;
                        }}
                    />
                </div>
            )}
        />
    );
};

export { Devices };
