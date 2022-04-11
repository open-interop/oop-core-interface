import React, { memo } from "react";
import { Select } from "baseui/select";
import { PairInput } from ".";

import TemplateInput from "../Global/TemplateInput";

const defaultAllowed = ["text", "mustache", "js"];
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
                languages={defaultAllowed}
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
                languages={defaultAllowed}
            />
            <TemplateInput
                label={"Path"}
                value={props.template.path}
                onChange={val => setValue("path", val)}
                languages={defaultAllowed}
            />
            <TemplateInput
                label={"Protocol"}
                value={props.template.protocol}
                onChange={val => setValue("protocol", val)}
                text={({ language, script }) => {
                    return (
                        <Select
                            options={protocolOptions}
                            labelKey="id"
                            valueKey="id"
                            searchable={false}
                            clearable={false}
                            onChange={event => {
                                setValue("protocol", {
                                    language,
                                    script: event.option.id,
                                });
                            }}
                            value={[
                                protocolOptions.find(
                                    item =>
                                        item.id ===
                                        (props.template.protocol && props.template.protocol.script),
                                ) || "http",
                            ]}
                            error={props.error}
                        />
                    );
                }}
                caption="required"
                languages={defaultAllowed}
            />
            <TemplateInput
                label={"Request Method"}
                value={props.template.requestMethod}
                onChange={val => setValue("requestMethod", val)}
                text={({ language, script }) => {
                    return (
                        <Select
                            options={requestMethodOptions}
                            labelKey="id"
                            valueKey="id"
                            searchable={false}
                            clearable={false}
                            onChange={event => {
                                setValue("requestMethod", {
                                    language,
                                    script: event.option.id,
                                });
                            }}
                            value={[
                                requestMethodOptions.find(
                                    item =>
                                        item.id ===
                                        (props.template.requestMethod &&
                                            props.template.requestMethod.script),
                                ) || "GET",
                            ]}
                            error={props.error}
                        />
                    );
                }}
                caption="required"
                languages={defaultAllowed}
            />
            <TemplateInput
                label={"Headers"}
                value={props.template.headers}
                onChange={val => setValue("headers", val)}
                languages={["json", "js"]}
                json={({ language, script }) => {
                    let headers;

                    try {
                        headers = JSON.parse(script || "{}");
                    } catch (e) {
                        headers = {};
                    }

                    return (
                        <PairInput
                            data={headers}
                            updateData={data => {
                                setValue("headers", {
                                    language,
                                    script: JSON.stringify(data),
                                });
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
