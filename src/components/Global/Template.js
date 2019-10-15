import React from "react";
import { Accordion, Panel } from "baseui/accordion";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Select } from "baseui/select";
import { PairInput } from ".";

const protocolOptions = [{ id: "http" }, { id: "https" }];
const requestMethodOptions = [
    { id: "DELETE" },
    { id: "GET" },
    { id: "PATCH" },
    { id: "POST" },
    { id: "PUT" },
];

const Template = props => {
    const setValue = (key, value) => {
        const updatedTemplate = { ...props.template };
        updatedTemplate[key] = value;
        props.updateTemplate(updatedTemplate);
    };

    return (
        <Accordion>
            <Panel title="Template">
                <div className="content-wrapper">
                    {props.endpointType === "http" && (
                        <>
                            <FormControl
                                label="Host"
                                key={"form-control-group-host"}
                            >
                                <Input
                                    id={"input-host"}
                                    value={props.template.host || ""}
                                    onChange={event =>
                                        setValue(
                                            "host",
                                            event.currentTarget.value,
                                        )
                                    }
                                />
                            </FormControl>
                            <FormControl
                                label="Port"
                                key={"form-control-group-port"}
                            >
                                <Input
                                    id={"input-port"}
                                    value={props.template.port}
                                    onChange={event =>
                                        setValue(
                                            "port",
                                            Number(event.currentTarget.value),
                                        )
                                    }
                                />
                            </FormControl>
                            <FormControl
                                label="Path"
                                key={"form-control-group-path"}
                            >
                                <Input
                                    id={"input-path"}
                                    value={props.template.path}
                                    onChange={event =>
                                        setValue(
                                            "path",
                                            event.currentTarget.value,
                                        )
                                    }
                                />
                            </FormControl>
                            <FormControl
                                label="Protocol"
                                key={"form-control-group-protocol"}
                            >
                                <Select
                                    options={protocolOptions}
                                    labelKey="id"
                                    valueKey="id"
                                    searchable={false}
                                    onChange={event => {
                                        setValue("protocol", event.option.id);
                                    }}
                                    value={protocolOptions.find(
                                        item =>
                                            item.id === props.template.protocol,
                                    )}
                                />
                            </FormControl>
                            <FormControl
                                label="Request Method"
                                key={"form-control-group-request-method"}
                            >
                                <Select
                                    options={requestMethodOptions}
                                    labelKey="id"
                                    valueKey="id"
                                    searchable={false}
                                    onChange={event => {
                                        setValue(
                                            "requestMethod",
                                            event.option.id,
                                        );
                                    }}
                                    value={requestMethodOptions.find(
                                        item =>
                                            item.id ===
                                            props.template.requestMethod,
                                    )}
                                />
                            </FormControl>
                            <FormControl
                                label="Headers"
                                key={"form-control-group-headers"}
                            >
                                <PairInput
                                    data={props.template.headers}
                                    updateData={value =>
                                        setValue("headers", value)
                                    }
                                />
                            </FormControl>
                        </>
                    )}
                </div>
            </Panel>
        </Accordion>
    );
};

export { Template };
