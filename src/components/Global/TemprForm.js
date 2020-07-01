import React, { memo } from "react";

import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Select } from "baseui/select";
import { Textarea } from "baseui/textarea";

import { TemprSelector } from "../Global";

const endpointTypeOptions = [{ id: "http" }, { id: "ftp" }];

const TemprForm = memo(props => {
    const [name, setName] = props.name;
    const [description, setDescription] = props.description;
    const [deviceGroupId, setDeviceGroupId] = props.deviceGroupId;
    const [parentTemprId, setParentTemprId] = props.parentTemprId;
    const [endpointType, setEndpointType] = props.endpointType;
    const [queueResponse, setQueueResponse] = props.queueResponse;
    const [queueRequest, setQueueRequest] = props.queueRequest;

    const setValue = setter => {
        return event => {
            props.setValueChanged(true);
            setter(event.currentTarget.value);
        };
    };

    return (
        <>
            <FormControl
                label="Name"
                key={"form-control-group-name"}
                error={
                    props.errors.name
                        ? `Name ${props.errors.name}`
                        : ""
                }
                caption="required"
            >
                <Input
                    id={"input-name"}
                    value={name}
                    onChange={setValue(setName)}
                    error={props.errors.name}
                />
            </FormControl>
            <FormControl
                label="Group"
                key={"form-control-group-group"}
                error={props.errors.deviceGroup}
                caption="required"
            >
                <Select
                    options={props.groups}
                    labelKey="name"
                    valueKey="id"
                    searchable={false}
                    clearable={false}
                    onChange={event => setDeviceGroupId(event.value[0].id)}
                    value={props.groups.filter(item => item.id === deviceGroupId)}
                    error={props.errors.deviceGroup}
                />
            </FormControl>
            <FormControl
                label="Parent Tempr"
                key={"form-control-group-parent"}
            >
                <TemprSelector
                    deviceGroup={deviceGroupId}
                    onChange={event => {
                        setParentTemprId(
                            event.value[0]
                                ? event.value[0].id
                                : null,
                        );
                    }}
                    value={parentTemprId}
                />
            </FormControl>
            <FormControl
                label="Description"
                key="form-control-notes"
            >
                <Textarea
                    value={description}
                    onChange={setValue(setDescription)}
                />
            </FormControl>
            <FormControl
                label="Endpoint type"
                key={"form-control-group-endpoint-type"}
                caption="required"
            >
                <Select
                    options={endpointTypeOptions}
                    labelKey="id"
                    valueKey="id"
                    searchable={false}
                    clearable={false}
                    onChange={event => setEndpointType(event.option.id)}
                    value={[endpointTypeOptions.find(
                        item => item.id === endpointType
                    ) || { id: "http" }]}
                    error={props.error}
                    disabled
                />
            </FormControl>
            <FormControl
                label="Queue Response"
                key={`form-control-queue-response`}
            >
                <Checkbox
                    checked={queueResponse}
                    onChange={() => setQueueResponse(!queueResponse)}
                    checkmarkType={STYLE_TYPE.toggle_round}
                />
            </FormControl>
            <FormControl
                label="Queue Request"
                key={`form-control-queue-request`}
            >
                <Checkbox
                    checked={queueRequest}
                    onChange={() => setQueueRequest(!queueRequest)}
                    checkmarkType={STYLE_TYPE.toggle_round}
                />
            </FormControl>
        </>
    );
});

export { TemprForm };
