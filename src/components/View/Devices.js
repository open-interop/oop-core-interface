import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SortableTable } from "../Universal";
import OopCore from "../../OopCore";

const Devices = () => {
    const [devices, setDevices] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        OopCore.getDevices()
            .then(response => setDevices(response))
            .catch(error => setErrorMessage(error.message));
    }, []);

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }

    if (devices && devices.length) {
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
    }

    return <div>Loading devices...</div>;
};

export { Devices };
