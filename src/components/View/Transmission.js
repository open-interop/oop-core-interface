import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FormControl } from "baseui/form-control";
import { Button } from "baseui/button";
import { Input } from "baseui/input";
import ArrowLeft from "baseui/icon/arrow-left";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import { DataProvider, Modal } from "../Universal";
import OopCore from "../../OopCore";
var JSONPretty = require("react-json-pretty");

const Transmission = props => {
    const [transmission, setTransmission] = useState({});

    const allTransmissionsPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    const setValue = (key, value) => {
        const updatedData = { ...transmission };
        updatedData[key] = value;
        setTransmission(updatedData);
    };

    return (
        <div className="content-wrapper">
            <Button $as={Link} to={allTransmissionsPath}>
                <ArrowLeft size={24} />
            </Button>
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
                        <FormControl
                            label="Transmission UUID"
                            key={`form-control-transmission-uuid`}
                        >
                            <Input
                                disabled
                                id={`input-transmission-uuid`}
                                value={transmission.transmission_uuid || ""}
                                onChange={event =>
                                    setValue(
                                        "transmission-uuid",
                                        event.currentTarget.value,
                                    )
                                }
                            />
                        </FormControl>
                        <FormControl
                            label="Message UUID"
                            key={`form-control-message-uuid`}
                        >
                            <Input
                                disabled
                                id={`input-message-uuid`}
                                value={transmission.message_uuid || ""}
                                onChange={event =>
                                    setValue(
                                        "message-uuid",
                                        event.currentTarget.value,
                                    )
                                }
                            />
                        </FormControl>
                        <FormControl label="Device" key={`form-control-device`}>
                            <Input
                                disabled
                                id={`input-device`}
                                value={transmission.device_id || ""}
                            />
                        </FormControl>
                        <FormControl
                            label="Device Tempr"
                            key={`form-control-device-tempr`}
                        >
                            <Input
                                disabled
                                id={`input-device-tempr-id`}
                                value={transmission.device_tempr_id || ""}
                            />
                        </FormControl>
                        <FormControl label="Status" key={`form-control-status`}>
                            <Checkbox
                                disabled
                                checked={transmission.status}
                                checkmarkType={STYLE_TYPE.toggle}
                            />
                        </FormControl>
                        <FormControl
                            label="Transmitted At"
                            key={`form-control-transmitted-at`}
                        >
                            <Input
                                disabled
                                type="datetime-local"
                                id={`input-transmitted-at`}
                                value={transmission.transmitted_at || ""}
                            />
                        </FormControl>
                        {transmission.body && (
                            <FormControl label="Body" key={`form-control-body`}>
                                <Modal
                                    buttonText="View"
                                    content={
                                        <JSONPretty
                                            data={transmission.body}
                                        ></JSONPretty>
                                    }
                                />
                            </FormControl>
                        )}
                    </>
                )}
            />
        </div>
    );
};

export { Transmission };
