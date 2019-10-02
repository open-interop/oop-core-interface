import React from "react";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";

const Form = props => {
    const setValue = (key, value) => {
        const updatedData = { ...props.data };
        updatedData[key] = value;
        props.setData(updatedData);
    };

    const getContent = key => {
        if (props.data[key] === Object(props.data[key])) {
            return props.data[key];
        } else {
            return (
                <Input
                    id={`input-${key}`}
                    value={props.data[key] || ""}
                    disabled={props.readOnly || props.data.readOnly}
                    onChange={event => setValue(key, event.currentTarget.value)}
                />
            );
        }
    };

    if (props.dataLabels) {
        return (
            <>
                {[...props.dataLabels.keys()].map(key => (
                    <FormControl
                        label={props.dataLabels.get(key)}
                        key={`form-control-${key}`}
                    >
                        {getContent(key)}
                    </FormControl>
                ))}
            </>
        );
    } else {
        return (
            <>
                {Object.keys(props.data).map(key => (
                    <FormControl label={key} key={`form-control-${key}`}>
                        {getContent(key)}
                    </FormControl>
                ))}
            </>
        );
    }
};

export { Form };
