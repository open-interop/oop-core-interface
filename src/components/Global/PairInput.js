import React, { useState, useEffect, useRef } from "react";
import { Button } from "baseui/button";
import { Input } from "baseui/input";

const PairInput = props => {
    const dataChanged = useRef(false);
    const dataIsArray = Array.isArray(props.data);

    const getArrayFromObject = () => {
        return props.data && Object.keys(props.data).length
            ? Object.entries(props.data)
            : [["", ""]];
    };

    const getDataArray = () => {
        return dataIsArray
            ? props.data.length
                ? props.data
                : [["", ""]]
            : getArrayFromObject();
    };

    const [dataArray, setDataArray] = useState(getDataArray());

    const updateDataArray = array => {
        dataChanged.current = true;
        setDataArray(array);
    };

    useEffect(() => {
        if (dataIsArray) {
            if (dataChanged.current) {
                props.updateData(
                    dataArray.find(item => item[0] && item[1])
                        ? dataArray.filter(item => item[0] && item[1])
                        : [["", ""]],
                );
            }
        } else {
            const resultObject = {};
            dataArray.forEach(item => {
                if (item[0] && item[1]) {
                    resultObject[item[0]] = item[1];
                }
            });

            if (dataChanged.current) {
                props.updateData(resultObject);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataArray]);

    useEffect(() => {
        const updatedArray = getDataArray();
        setDataArray(updatedArray);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.refreshKey]);

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
            <div className="one-row space-between mb-10" key={`row-${index}`}>
                <div className="width-49 left-margin">
                    <Input
                        error={props.error || (!key && value)}
                        placeholder="Key"
                        id={`input-header-key-${key || "new"}`}
                        value={key || ""}
                        onChange={setData(index, 0)}
                    />
                </div>
                <div className="width-49 left-margin">
                    <Input
                        error={props.error || (key && !value)}
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
            {dataArray.map((row, index) => {
                return InputRow(index, row[0], row[1]);
            })}
            <Button onClick={addRow}>+</Button>
        </>
    );
};

export { PairInput };
