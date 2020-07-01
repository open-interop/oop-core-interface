import React, { memo } from "react";
import { useStyletron } from "baseui";
import { Button, KIND } from "baseui/button";
import { Input } from "baseui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const InputRow = props => {
    const [css, theme] = useStyletron();

    const { index, pair: [key, value] } = props;

    return (
        <div className={css({ display: "flex", flexDirection: "row", marginBottom: theme.sizing.scale550 })} >
            <div className={css({ display: "flex", flexGrow: 1 })} >
                <div className={css({ flexGrow: 1 })}>
                    <Input
                        error={props.error || (!key && value)}
                        placeholder="Key"
                        value={key || ""}
                        onChange={props.onChangeKey}
                    />
                </div>
                <div className={css({ flexGrow: 1,  marginLeft: theme.sizing.scale550 })}>
                    <Input
                        error={props.error || (key && !value)}
                        placeholder="Value"
                        value={value || ""}
                        onChange={props.onChangeValue}
                    />
                </div>
            </div>
            <Button
                kind={KIND.tertiary}
                className={css({ marginLeft: "auto" })}
                aria-label="remove-input-row"
                onClick={props.onRemove}
            >
                <FontAwesomeIcon icon={faMinus} />
            </Button>
        </div>
    );
};

const PairInput = memo(props => {
    const dataIsArray = Array.isArray(props.data);

    let dataArray;
    if (dataIsArray) {
        dataArray = props.data;
    } else {
        dataArray = Object.entries(props.data);
    }

    if (!dataArray.length) {
        dataArray = [["", ""]];
    }

    const update = (data) => {
        if (dataIsArray) {
            const filtered = data.filter(item => item[0] && item[1]);

            if (filtered.length) {
                props.updateData(filtered);
            } else {
                props.updateData([["", ""]]);
            }
        } else {
            const resultObject = {};

            for (const [key, val] of data) {
                resultObject[key] = val;
            }

            props.updateData(resultObject);
        }
    };

    const removeRow = index => {
        const updatedArray = [...dataArray];

        if (updatedArray.length > 1) {
            updatedArray.splice(index, 1);
        } else {
            updatedArray[index][0] = "";
            updatedArray[index][1] = "";
        }

        update(updatedArray);
    };

    const addRow = () => {
        const updatedArray = [...dataArray];
        if (
            updatedArray[updatedArray.length - 1][0] ||
            updatedArray[updatedArray.length - 1][1]
        ) {
            updatedArray.push(["", ""]);
            update(updatedArray);
        }
    };

    const setData = (index, position) => {
        return event => {
            const updatedArray = [...dataArray];
            updatedArray[index][position] = event.currentTarget.value;

            update(updatedArray);
        }
    };

    return (
        <>
            {
                dataArray.map((row, index) => 
                    <InputRow
                        key={index}
                        index={index}
                        pair={row}
                        onChangeKey={setData(index, 0)}
                        onChangeValue={setData(index, 1)}
                        onRemove={() => removeRow(index)}
                        error={props.error}
                    />
                )
            }
            <Button
                kind={KIND.tertiary}
                onClick={addRow}
                aria-label="add-input-row"
            >
                <FontAwesomeIcon icon={faPlus} />
            </Button>
        </>
    );
});

export { PairInput };
