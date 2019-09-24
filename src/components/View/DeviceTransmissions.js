import React, { useEffect, useState } from "react";
import { Button } from "baseui/button";
import { LineWrapper, SortableTable, PaginationWrapper } from "../Global";
import OopCore from "../../OopCore";

const DeviceTransmissions = props => {
    const [transmissions, setTransmissions] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        OopCore.getDeviceTransmissions(props.match.params.deviceId)
            .then(response => setTransmissions(response))
            .catch(error => setErrorMessage(error.message));
    }, [props.match.params.deviceId]);

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }

    if (transmissions) {
        return (
            <div className="device-transmissions">
                <h2>Transmissions - Device {props.match.params.deviceId}</h2>
                <LineWrapper title={"Filters"}></LineWrapper>
                <PaginationWrapper
                    data={transmissions}
                    render={rows => (
                        <SortableTable
                            data={rows}
                            mapFunction={(columnName, content) => {
                                if (columnName === "action") {
                                    return <Button>{content}</Button>;
                                }
                                return content;
                            }}
                            columns={[
                                { id: "id", name: "Id" },
                                {
                                    id: "device_tempr_id",
                                    name: "Device Tempr Id",
                                },
                                {
                                    id: "transmission_uuid",
                                    name: "Transmission UUID",
                                },
                                { id: "message_uuid", name: "Message UUID" },
                                { id: "status", name: "Status" },
                                { id: "action", name: "Action" },
                            ]}
                        />
                    )}
                />
            </div>
        );
    }

    return <div>Loading device transmissions...</div>;
};

export { DeviceTransmissions };
