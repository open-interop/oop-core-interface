import React, { useState } from "react";
import AceEditor from "react-ace";
import { Accordion, Panel } from "baseui/accordion";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Select } from "baseui/select";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";

import "brace/mode/json";
import "brace/theme/github";

const protocolOptions = [{ id: "http" }, { id: "https" }];
const requestMethodOptions = [
    { id: "DELETE" },
    { id: "GET" },
    { id: "PATCH" },
    { id: "POST" },
    { id: "PUT" },
];

const Template = props => {
    const [host, setHost] = useState(props.host);
    const [port, setPort] = useState(props.port);
    const [path, setPath] = useState(props.path);
    const [protocol, setProtocol] = useState(props.protocol);
    const [requestMethod, setRequestMethod] = useState(props.requestMethod);
    const [headers, setHeaders] = useState(props.headers);
    const [body, setBody] = useState(props.body);

    return (
        <Accordion>
            <Panel title="Template">
                {props.endpointType === "http" && (
                    <>
                        <FormControl
                            label="Host"
                            key={"form-control-group-host"}
                        >
                            <Input
                                id={"input-host"}
                                value={host || ""}
                                onChange={event =>
                                    setHost(event.currentTarget.value)
                                }
                            />
                        </FormControl>
                        <FormControl
                            label="Port"
                            key={"form-control-group-port"}
                        >
                            <Input
                                id={"input-port"}
                                value={port}
                                onChange={event =>
                                    setPort(event.currentTarget.value)
                                }
                            />
                        </FormControl>
                        <FormControl
                            label="Path"
                            key={"form-control-group-path"}
                        >
                            <Input
                                id={"input-path"}
                                value={path}
                                onChange={event =>
                                    setPath(event.currentTarget.value)
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
                                    setProtocol(event.option.id);
                                }}
                                value={protocolOptions.find(
                                    item => item.id === protocol,
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
                                    setRequestMethod(event.option.id);
                                }}
                                value={requestMethodOptions.find(
                                    item => item.id === requestMethod,
                                )}
                            />
                        </FormControl>
                        <FormControl
                            label="Headers"
                            key={"form-control-group-headers"}
                        >
                            <div>here be headers</div>
                        </FormControl>
                        <FormControl
                            label="Body"
                            key={"form-control-group-body"}
                        >
                            <AceEditor
                                width="100%"
                                height="200px"
                                showPrintMargin={false}
                                mode="json"
                                theme="github"
                                onChange={value =>
                                    setBody({
                                        language: body.language,
                                        script: value,
                                    })
                                }
                                editorProps={{ $blockScrolling: true }}
                                value={body.script}
                            />
                        </FormControl>
                    </>
                )}
            </Panel>
        </Accordion>
    );
};

export { Template };
