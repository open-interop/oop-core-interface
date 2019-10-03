import React from "react";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";

const Form = props => {
    const setValue = (key, value) => {
        const updatedData = { ...props.data };
        updatedData[key] = value;
        props.setData(updatedData);
    };

    const getFormRow = key => {
        if (props.data[key] === Object(props.data[key])) {
            if (props.data[key].constructor === Array) {
                return <div>This would be an array</div>;
            }
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

    // The optional dataLabels prop is a map object used to
    // 1) override the object property names with custom labels and
    // 2) define the order in which they appear
    if (props.dataLabels) {
        return (
            <>
                {[...props.dataLabels.keys()].map(key => (
                    <FormControl
                        label={props.dataLabels.get(key)}
                        key={`form-control-${key}`}
                    >
                        {getFormRow(key)}
                    </FormControl>
                ))}
            </>
        );
    } else {
        return (
            <>
                {Object.keys(props.data).map(key => (
                    <FormControl label={key} key={`form-control-${key}`}>
                        {getFormRow(key)}
                    </FormControl>
                ))}
            </>
        );
    }
};

export { Form };
