import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import ArrowLeft from "baseui/icon/arrow-left";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { clearToast, ErrorToast, SuccessToast } from "../Global";
import OopCore from "../../OopCore";
import { DataProvider } from "../Universal";

const DeviceGroup = props => {
    const [deviceGroup, setDeviceGroup] = useState({});
    const [updatedDeviceGroup, setUpdatedDeviceGroup] = useState({});
    const blankDeviceGroup = props.match.params.deviceGroupId === "new";

    const allDeviceGroupsPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    const setValue = (key, value) => {
        const updatedData = { ...updatedDeviceGroup };
        updatedData[key] = value;
        setUpdatedDeviceGroup(updatedData);
    };

    const getDeviceGroup = () => {
        return blankDeviceGroup
            ? Promise.resolve({
                  name: "",
              })
            : OopCore.getDeviceGroup(props.match.params.deviceGroupId);
    };

    const updateState = data => {
        setDeviceGroup(data);
        setUpdatedDeviceGroup(data);
    };
    return (
        <div className="content-wrapper">
            <Button $as={Link} to={allDeviceGroupsPath}>
                <ArrowLeft size={24} />
            </Button>
            <h2>
                {blankDeviceGroup ? "Create device group" : "Edit device group"}
            </h2>
            <DataProvider
                getData={() => {
                    return getDeviceGroup().then(data => updateState(data));
                }}
                renderKey={props.location.pathname}
                renderData={() => (
                    <>
                        <FormControl
                            label="Name"
                            key={`form-control-name`}
                            caption="required"
                        >
                            <Input
                                required
                                id={`input-name`}
                                value={updatedDeviceGroup.name || ""}
                                onChange={event =>
                                    setValue("name", event.currentTarget.value)
                                }
                            />
                        </FormControl>
                        <FormControl
                            label="Description"
                            key={`form-control-description`}
                        >
                            <Input
                                id={`input-description`}
                                value={updatedDeviceGroup.description || ""}
                                onChange={event =>
                                    setValue(
                                        "description",
                                        event.currentTarget.value,
                                    )
                                }
                            />
                        </FormControl>

                        <Button
                            onClick={() => {
                                clearToast();

                                if (blankDeviceGroup) {
                                    OopCore.createDeviceGroup(
                                        updatedDeviceGroup,
                                    )
                                        .then(response => {
                                            SuccessToast(
                                                "Created new device group",
                                                "Success",
                                            );
                                            props.history.replace(
                                                `${allDeviceGroupsPath}/${response.id}`,
                                            );
                                            updateState(response);
                                        })
                                        .catch(error => {
                                            console.error(error);
                                            ErrorToast(
                                                "Failed to create device group",
                                                "Error",
                                            );
                                        });
                                } else {
                                    OopCore.updateDeviceGroup(
                                        updatedDeviceGroup,
                                    )
                                        .then(response => {
                                            SuccessToast(
                                                "Updated device group",
                                                "Success",
                                            );
                                            updateState(response);
                                        })
                                        .catch(error => {
                                            console.error(error);
                                            ErrorToast(
                                                "Failed to update device group",
                                                "Error",
                                            );
                                        });
                                }
                            }}
                            disabled={
                                !updatedDeviceGroup.name ||
                                Object.keys(deviceGroup).every(
                                    key =>
                                        deviceGroup[key] ===
                                        updatedDeviceGroup[key],
                                )
                            }
                        >
                            {blankDeviceGroup ? "Create" : "Save"}
                        </Button>
                    </>
                )}
            />
        </div>
    );
};

export { DeviceGroup };
