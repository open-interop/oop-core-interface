import React, { useState, useEffect, useRef } from "react";
import { Button } from "baseui/button";
import { Input } from "baseui/input";

const MultiInput = props => {
    const dataChanged = useRef(false);

    const [dataArray, setDataArray] = useState(props.data);

    const updateDataArray = array => {
        dataChanged.current = true;
        setDataArray(array);
    };

    useEffect(() => {
        const resultObject = {};
        dataArray.forEach(item => {
            if (item[0] && item[1]) {
                resultObject[item[0]] = item[1];
            }
        });

        if (dataChanged.current) {
            props.updateData(resultObject);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataArray]);

    const removeRow = index => {
        const updatedArray = [...dataArray];
        if (updatedArray.length > 1) {
            updatedArray.splice(index, 1);
        } else {
            updatedArray[index][0] = "";
            updatedArray[index][1] = "";
        }
        updateDataArray(updatedArray);
    };

    const addRow = () => {
        const updatedArray = [...dataArray];
        if (
            updatedArray[updatedArray.length - 1][0] ||
            updatedArray[updatedArray.length - 1][1]
        ) {
            updatedArray.push(["", ""]);
            updateDataArray(updatedArray);
        }
    };

    const setData = (index, position) => event => {
        const updatedArray = [...dataArray];
        updatedArray[index][position] = event.currentTarget.value;
        updateDataArray(updatedArray);
    };

    const InputRow = (index, key, value) => {
        return (
            <div className="one-row space-between mb" key={`row-${index}`}>
                <div className="half left-margin">
                    <Input
                        placeholder="Key"
                        id={`input-header-key-${key || "new"}`}
                        value={key || ""}
                        onChange={setData(index, 0)}
                    />
                </div>
                <div className="half left-margin">
                    <Input
                        placeholder="Value"
                        id={`input-header-value-${value || "new"}`}
                        value={value || ""}
                        onChange={setData(index, 1)}
                    />
                </div>
                <Button
                    className="left-margin"
                    onClick={() => removeRow(index)}
                >
                    -
                </Button>
            </div>
        );
    };

    return (
        <>
            {dataArray.map((row, index) => InputRow(index, row[0], row[1]))}
            <Button onClick={addRow}>+</Button>
        </>
    );
};

export { MultiInput };
