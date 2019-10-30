import React from "react";
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

const HttpTemprTemplate = props => {
    const setValue = (key, value) => {
        const updatedTemplate = { ...props.template };
        updatedTemplate[key] = value;
        props.updateTemplate(updatedTemplate);
    };

    const identicalArray = (oldArray, updatedArray) => {
        if (oldArray.length !== updatedArray.length) {
            return false;
        }

        var i = 0;
        var foundDifferentValue = false;
        while (i < oldArray.length && !foundDifferentValue) {
            if (Array.isArray(oldArray[i])) {
                if (identicalArray(oldArray[i], updatedArray[i])) {
                    i++;
                } else {
                    foundDifferentValue = true;
                }
            } else {
                if (oldArray[i] !== updatedArray[i]) {
                    foundDifferentValue = true;
                } else {
                }
                i++;
            }
        }

        return !foundDifferentValue;
    };
    return (
        props.endpointType === "http" && (
            <>
                <FormControl
                    label="Host"
                    key={"form-control-group-host"}
                    caption="required"
                >
                    <Input
                        id={"input-host"}
                        value={props.template.host || ""}
                        onChange={event =>
                            setValue("host", event.currentTarget.value)
                        }
                        error={props.error}
                    />
                </FormControl>
                <FormControl
                    label="Port"
                    key={"form-control-group-port"}
                    caption="required"
                >
                    <Input
                        id={"input-port"}
                        value={props.template.port}
                        onChange={event =>
                            setValue("port", Number(event.currentTarget.value))
                        }
                        error={props.error}
                    />
                </FormControl>
                <FormControl
                    label="Path"
                    key={"form-control-group-path"}
                    caption="required"
                >
                    <Input
                        id={"input-path"}
                        value={props.template.path}
                        onChange={event =>
                            setValue("path", event.currentTarget.value)
                        }
                        error={props.error}
                    />
                </FormControl>
                <FormControl
                    label="Protocol"
                    key={"form-control-group-protocol"}
                    caption="required"
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
                            item => item.id === props.template.protocol,
                        )}
                        error={props.error}
                    />
                </FormControl>
                <FormControl
                    label="Request Method"
                    key={"form-control-group-request-method"}
                    caption="required"
                >
                    <Select
                        options={requestMethodOptions}
                        labelKey="id"
                        valueKey="id"
                        searchable={false}
                        onChange={event => {
                            setValue("requestMethod", event.option.id);
                        }}
                        value={requestMethodOptions.find(
                            item => item.id === props.template.requestMethod,
                        )}
                        error={props.error}
                    />
                </FormControl>
                <FormControl label="Headers" key={"form-control-group-headers"}>
                    <PairInput
                        data={
                            props.template.headers.length < 1
                                ? [["", ""]]
                                : props.template.headers
                        }
                        updateData={data => {
                            if (identicalArray(data, [["", ""]])) {
                                setValue("headers", []);
                            } else {
                                setValue("headers", data);
                            }
                        }}
                    />
                </FormControl>
            </>
        )
    );
};

export { HttpTemprTemplate };
