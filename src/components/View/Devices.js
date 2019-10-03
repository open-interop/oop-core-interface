import React, { useState } from "react";
import { Link } from "react-router-dom";
import Show from "baseui/icon/show";
import Menu from "baseui/icon/menu";
import { DataProvider } from "../Universal";
import { SortableTable } from "../Global";
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
                <SortableTable
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
            )}
        />
    );
};

export { Devices };
