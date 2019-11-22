import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FormControl } from "baseui/form-control";
import { Button, KIND } from "baseui/button";
import { Input } from "baseui/input";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import { DataProvider, Modal } from "../Universal";
import OopCore from "../../OopCore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
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
            <Button
                $as={Link}
                kind={KIND.minimal}
                to={allTransmissionsPath}
                aria-label="Go back to all transmissions"
            >
                <FontAwesomeIcon icon={faChevronLeft} />
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
                                value={transmission.transmissionUuid || ""}
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
                                value={transmission.messageUuid || ""}
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
                                value={transmission.deviceId || ""}
                            />
                        </FormControl>
                        <FormControl
                            label="Device Tempr"
                            key={`form-control-device-tempr`}
                        >
                            <Input
                                disabled
                                id={`input-device-tempr-id`}
                                value={transmission.deviceTemprId || ""}
                            />
                        </FormControl>
                        <FormControl label="Status" key={`form-control-status`}>
                            <Checkbox
                                disabled
                                checked={transmission.status}
                                checkmarkType={STYLE_TYPE.toggle_round}
                            />
                        </FormControl>
                        <FormControl
                            label="Transmitted At"
                            key={`form-control-transmitted-at`}
                        >
                            <Input
                                disabled
                                id={`input-transmitted-at`}
                                value={transmission.transmittedAt || ""}
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
