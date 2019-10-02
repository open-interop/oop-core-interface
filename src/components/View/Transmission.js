import React, { useState } from "react";
import { DataProvider, Modal } from "../Universal";
import OopCore from "../../OopCore";
var JSONPretty = require("react-json-pretty");

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
                        {transmission.id}
                        <Modal
                            content={
                                <JSONPretty
                                    id="json-pretty"
                                    data={`{"event": {"patientId":1,"testId":1,"result": "positive"}}`}
                                ></JSONPretty>
                            }
                        />
                    </>
                )}
            />
        </div>
    );
};

export { Transmission };
