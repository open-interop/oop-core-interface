import React, { useState } from "react";
import { Checkbox } from "baseui/checkbox";

const TrueFalseCheckboxes = props => {
    const getValuesFromProps = () => {
        switch (props.value) {
            case "":
                return [true, true];

            case "true":
            case true:
                return [true, false];

            case "false":
            case false:
                return [false, true];

            default:
                return [false, false];
        }
    };
    const [checkboxes, setCheckboxes] = useState(getValuesFromProps());

    function toggleCheckbox(checkboxNumber) {
        const updatedCheckboxes = [...checkboxes];
        updatedCheckboxes[checkboxNumber] = !checkboxes[checkboxNumber];
        setCheckboxes(updatedCheckboxes);

        if (!updatedCheckboxes[0] && !updatedCheckboxes[1]) {
            updatedCheckboxes[Math.abs(checkboxNumber - 1)] = !updatedCheckboxes[
                Math.abs(checkboxNumber - 1)
            ];
        }

        if (updatedCheckboxes[0] && !updatedCheckboxes[1]) {
            props.setValue(true);
        } else if (!updatedCheckboxes[0] && updatedCheckboxes[1]) {
            props.setValue(false);
        } else {
            props.setValue(null);
        }
    }

    return (
        <>
            <Checkbox checked={checkboxes[0]} onChange={() => toggleCheckbox(0)}>
                {props.trueText || "true"}
            </Checkbox>
            <Checkbox checked={checkboxes[1]} onChange={() => toggleCheckbox(1)}>
                {props.falseText || "false"}
            </Checkbox>
        </>
    );
};

export { TrueFalseCheckboxes };
