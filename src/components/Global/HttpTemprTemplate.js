import React, { memo } from "react";
import { Select } from "baseui/select";
import { PairInput } from ".";

import TemplateInput from "../Global/TemplateInput";

const protocolOptions = [{ id: "http" }, { id: "https" }];
const requestMethodOptions = [
    { id: "DELETE" },
    { id: "GET" },
    { id: "PATCH" },
    { id: "POST" },
    { id: "PUT" },
];

const HttpTemprTemplate = memo(props => {
    const setValue = (key, value) => {
        const updatedTemplate = { ...props.template };

        updatedTemplate[key] = value;

        props.updateTemplate(updatedTemplate);
    };

    return (
        <>
            <TemplateInput
                label={"Host"}
                value={props.template.host}
                onChange={val => setValue("host", val)}
                caption="required"
            />
            <TemplateInput
                label={"Port"}
                value={props.template.port}
                onChange={val => {
                    if (val.language === "text") {
                        val.script = Number(val.script);
                    }
                    setValue("port", val);
                }}
            />
            <TemplateInput
                label={"Path"}
                value={props.template.path}
                onChange={val => setValue("path", val)}
            />
            <TemplateInput
                label={"Protocol"}
                value={props.template.protocol}
                onChange={val => setValue("protocol", val)}
                basic={({ language, script }) => {
                    return (
                        <Select
                            options={protocolOptions}
                            labelKey="id"
                            valueKey="id"
                            searchable={false}
                            clearable={false}
                            onChange={event => {
                                setValue("protocol", event.option.id);
                            }}
                            value={[protocolOptions.find(
                                item => item.id === script,
                            ) || "http"]}
                            error={props.error}
                        />
                    );
                }}
                caption="required"
            />
            <TemplateInput
                label={"Request Method"}
                value={props.template.requestMethod}
                onChange={val => setValue("requestMethod", val)}
                basic={({ language, script }) => {
                    return (
                        <Select
                            options={requestMethodOptions}
                            labelKey="id"
                            valueKey="id"
                            searchable={false}
                            clearable={false}
                            onChange={event => {
                                setValue("requestMethod", event.option.id);
                            }}
                            value={[requestMethodOptions.find(
                                item => item.id === props.template.requestMethod,
                            ) || "GET"]}
                            error={props.error}
                        />
                    );
                }}
                caption="required"
            />
            <TemplateInput
                label={"Headers"}
                value={props.template.headers}
                onChange={val => setValue("headers", val)}
                basic={({ language, script }) => {
                    return (
                        <PairInput
                            data={props.template.headers || {}}
                            updateData={data => {
                                setValue("headers", data);
                            }}
                        />
                    );
                }}
            />
            <TemplateInput
                label={"Body"}
                value={props.template.body}
                onChange={val => setValue("body", val)}
            />
        </>
    );
});

export { HttpTemprTemplate };
