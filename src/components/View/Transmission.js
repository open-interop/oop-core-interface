import React, { useState } from "react";
import { DataProvider, Modal } from "../Universal";
import { Form, InputType } from "../Global";
import OopCore from "../../OopCore";
var JSONPretty = require("react-json-pretty");

const Transmission = props => {
    const [transmission, setTransmission] = useState({});

    const formDataWithBodyComponent = transmission;
    formDataWithBodyComponent.body = (
        <Modal
            buttonText="View"
            content={<JSONPretty data={transmission.body}></JSONPretty>}
        />
    );

    return (
        <div className="content-wrapper">
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
                        <Form
                            readOnly={true}
                            data={formDataWithBodyComponent}
                            setData={setTransmission}
                            dataTypes={{
                                transmission_uuid: InputType.STRING_INPUT,
                                message_uuid: InputType.STRING_INPUT,
                                device_id: InputType.NUMBER_INPUT,
                                device_tempr_id: InputType.NUMBER_INPUT,
                                status: InputType.TOGGLE,
                                transmitted_at: InputType.DATETIME_PICKER,
                                body: InputType.COMPONENT,
                            }}
                            dataLabels={
                                new Map([
                                    ["transmission_uuid", "Transmission UUID"],
                                    ["message_uuid", "Message UUID"],
                                    ["device_id", "Device"],
                                    ["device_tempr_id", "Device Tempr"],
                                    ["status", "Status"],
                                    ["transmitted_at", "Transmitted At"],
                                    ["body", "Body"],
                                ])
                            }
                        />
                    </>
                )}
            />
        </div>
    );
};

export { Transmission };
