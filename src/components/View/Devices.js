import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SortableTable } from "../Global";
import OopCore from "../../OopCore";

const Devices = () => {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        OopCore.getDevices().then(response => setDevices(response));
    }, []);

    return (
        <>
            <SortableTable
                data={devices}
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
        </>
    );
};

export { Devices };
