import React, { useState } from "react";
import { Link } from "react-router-dom";
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
                        if (columnName === "id") {
                            return (
                                <Link to={`/devices/${content}/transmissions`}>
                                    {content}
                                </Link>
                            );
                        }
                    }}
                    columns={[{ id: "id", name: "Device ID" }]}
                />
            )}
            renderKey="1234"
        />
    );
};

export { Devices };
