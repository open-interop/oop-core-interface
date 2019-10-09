import React from "react";
import PropTypes from "prop-types";
import { FormControl } from "baseui/form-control";
import { Button } from "baseui/button";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import { Input } from "baseui/input";
import { Select } from "baseui/select";

const InputType = {
    STRING_INPUT: "string",
    NUMBER_INPUT: "number",
    SELECT: "select",
    SEARCHABLE_SELECT: "searchable",
    TOGGLE: "toggle",
    DATETIME_PICKER: "datetime",
    COMPONENT: "component",
};

const Form = props => {
    const data = props.data;
    const setValue = (key, value) => {
        const updatedData = { ...data };
        updatedData[key] = value;
        props.setData(updatedData);
    };

    const getFormRow = key => {
        if (data[key] === undefined) {
            return <div>No content available</div>;
        }

        switch (props.dataTypes[key]) {
            case InputType.STRING_INPUT:
                return (
                    <Input
                        id={`input-${key}`}
                        value={data[key] || ""}
                        disabled={props.readOnly || data.readOnly}
                        onChange={event =>
                            setValue(key, event.currentTarget.value)
                        }
                    />
                );
            case InputType.SELECT:
                return (
                    <Select
                        disabled={props.readOnly || data.readOnly}
                        options={data[key]}
                        labelKey="name"
                        valueKey="id"
                        searchable={false}
                        onChange={event =>
                            setValue(props.targetValue(key), event.value[0].id)
                        }
                        value={data[key].find(
                            item => item.id === data[props.targetValue(key)],
                        )}
                    />
                );
            case InputType.SEARCHABLE_SELECT:
                return (
                    <Select
                        disabled={props.readOnly || data.readOnly}
                        options={data[key]}
                        labelKey="name"
                        valueKey="id"
                        searchable={true}
                        onChange={event =>
                            setValue(props.targetValue(key), event.value[0].id)
                        }
                        value={data[key].find(
                            item => item.id === data[props.targetValue(key)],
                        )}
                    />
                );
            case InputType.NUMBER_INPUT:
                return (
                    <Input
                        type="number"
                        id={`input-${key}`}
                        value={data[key] || ""}
                        disabled={props.readOnly || data.readOnly}
                        onChange={event =>
                            setValue(key, Number(event.currentTarget.value))
                        }
                    />
                );
            case InputType.TOGGLE:
                return (
                    <Checkbox
                        disabled={props.readOnly || data.readOnly}
                        checked={data[key]}
                        onChange={() => setValue(key, !data[key])}
                        checkmarkType={STYLE_TYPE.toggle}
                    />
                );
            case InputType.DATETIME_PICKER:
                return (
                    <Input
                        type="datetime-local"
                        id={`input-${key}`}
                        value={data[key] || ""}
                        disabled={props.readOnly || data.readOnly}
                        onChange={event =>
                            setValue(key, event.currentTarget.value)
                        }
                    />
                );
            case InputType.COMPONENT:
                return data[key];

            default:
                return <div>No content available</div>;
        }
    };

    // The optional dataLabels prop is a map object used to
    // 1) override the object property names with custom labels and
    // 2) define the order in which they appear
    const formBody = () => {
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

    return (
        <>
            {formBody()}
            {!props.readOnly && (
                <Button onClick={props.onSave} disabled={props.saveDisabled}>
                    {props.buttonText || "Save"}
                </Button>
            )}
            {props.error && <div>{props.error}</div>}
        </>
    );
};

Form.propTypes = {
    data: PropTypes.object.isRequired,
    setData: PropTypes.func.isRequired,
    dataTypes: PropTypes.object.isRequired,
};

export { Form, InputType };
