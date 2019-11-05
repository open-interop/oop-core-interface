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
    const template = props.template;
    console.log(template);

    const setValue = (key, value) => {
        const updatedTemplate = { ...template };
        updatedTemplate[key] = value;
        props.updateTemplate(updatedTemplate);
    };

    return (
        <>
            <FormControl
                label="Host"
                key={"form-control-group-host"}
                caption="required"
            >
                <Input
                    id={"input-host"}
                    value={template.host || ""}
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
                    value={template.port}
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
                    value={template.path}
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
                        item => item.id === template.protocol,
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
                        item => item.id === template.requestMethod,
                    )}
                    error={props.error}
                />
            </FormControl>
            <FormControl label="Headers" key={"form-control-group-headers"}>
                <PairInput
                    data={template.headers || {}}
                    updateData={data => {
                        setValue("headers", data);
                    }}
                />
            </FormControl>
        </>
    );
};

export { HttpTemprTemplate };
