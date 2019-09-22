import React, { useEffect, useState } from "react";
import { Button } from "baseui/button";
import { SortableTable } from "../Global";
import OopCore from "../../OopCore";

const DeviceTransmissions = () => {
    const [transmissions, setTransmissions] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        OopCore.getDeviceTransmissions(1)
            .then(response => setTransmissions(response))
            .catch(error => setErrorMessage(error.message));
    }, []);

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }

    if (transmissions && transmissions.length) {
        return (
            <>
                <SortableTable
                    data={transmissions}
                    mapFunction={(columnName, content) => {
                        if (columnName === "action") {
                            return <Button>{content}</Button>;
                        }
                        return content;
                    }}
                    columns={[
                        { id: "id", name: "Id" },
                        { id: "device_tempr_id", name: "Device Tempr Id" },
                        { id: "transmission_uuid", name: "Transmission UUID" },
                        { id: "message_uuid", name: "Message UUID" },
                        { id: "status", name: "Status" },
                        { id: "action", name: "Action" },
                    ]}
                />
            </>
        );
    }

    return <div>Loading device transmissions...</div>;
};

export { DeviceTransmissions };
