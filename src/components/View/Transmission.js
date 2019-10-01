import React, { useState } from "react";
import { Modal } from "../Global";
import { DataProvider } from "../Universal";
import OopCore from "../../OopCore";

const Transmission = props => {
    const [transmission, setTransmission] = useState(null);
    return (
        <div className="device-transmissions">
            <DataProvider
                getData={() => {
                    return OopCore.getTransmission(
                        props.match.params.deviceId,
                        props.match.params.transmissionId,
                    ).then(response => {
                        setTransmission(response);
                        return response;
                    });
                }}
                renderData={() => (
                    <>
                        {" "}
                        {transmission.id} <Modal />
                    </>
                )}
            />
        </div>
    );
};

export { Transmission };
