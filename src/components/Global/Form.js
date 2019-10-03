import React from "react";
import { FormControl } from "baseui/form-control";
import { Select } from "baseui/select";
import { Input } from "baseui/input";

const Form = props => {
    const data = props.data;

    const setValue = (key, value) => {
        const updatedData = { ...data };
        updatedData[key] = value;
        props.setData(updatedData);
    };

    const getFormRow = key => {
        if (data[key] === Object(data[key])) {
            if (data[key].constructor === Array) {
                return (
                    <Select
                        options={data[key]}
                        labelKey="name"
                        valueKey="id"
                        searchable={false}
                        clearable={false}
                        onChange={event =>
                            setValue(
                                props.selectedValue(key),
                                event.value[0].id,
                            )
                        }
                        value={data[key].find(
                            item => item.id === data[props.selectedValue(key)],
                        )}
                    />
                );
            }
            return data[key];
        } else {
            return (
                <Input
                    id={`input-${key}`}
                    value={data[key] || ""}
                    disabled={props.readOnly || data.readOnly}
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
                {Object.keys(data).map(key => (
                    <FormControl label={key} key={`form-control-${key}`}>
                        {getFormRow(key)}
                    </FormControl>
                ))}
            </>
        );
    }
};

export { Form };
