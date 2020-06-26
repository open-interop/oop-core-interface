import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, KIND } from "baseui/button";
import { Heading, HeadingLevel } from "baseui/heading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { clearToast, ErrorToast, SuccessToast } from "../Global";
import { identicalObject } from "../../Utilities";
import OopCore from "../../OopCore";
import { ConfirmModal, DataProvider } from "../Universal";

const DeviceGroup = props => {
    const [deviceGroup, setDeviceGroup] = useState({});
    const [updatedDeviceGroup, setUpdatedDeviceGroup] = useState({});
    const [deviceGroupErrors, setDeviceGroupErrors] = useState({});
    const blankDeviceGroup = props.match.params.deviceGroupId === "new";

    const allDeviceGroupsPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    useEffect(() => {
        document.title = blankDeviceGroup
            ? "New Device Group | Settings | Open Interop"
            : "Edit Device Group | Settings | Open Interop";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const deleteDeviceGroup = () => {
        return OopCore.deleteDeviceGroup(updatedDeviceGroup.id)
            .then(() => {
                props.history.replace(`/device-groups`);
                SuccessToast("Deleted device group", "Success");
            })
            .catch(error => {
                console.error(error);
                ErrorToast("Could not delete device group", "Error");
            });
    };

    const saveDeviceGroup = () => {
        clearToast();
        setDeviceGroupErrors({});
        if (blankDeviceGroup) {
            OopCore.createDeviceGroup(updatedDeviceGroup)
                .then(response => {
                    SuccessToast("Created new device group", "Success");
                    props.history.replace(
                        `${allDeviceGroupsPath}/${response.id}`,
                    );
                    updateState(response);
                })
                .catch(error => {
                    setDeviceGroupErrors(error);
                    ErrorToast("Failed to create device group", "Error");
                });
        } else {
            OopCore.updateDeviceGroup(updatedDeviceGroup)
                .then(response => {
                    SuccessToast("Updated device group", "Success");
                    updateState(response);
                })
                .catch(error => {
                    setDeviceGroupErrors(error);
                    ErrorToast("Failed to update device group", "Error");
                });
        }
    };

    return (
        <div className="content-wrapper">
            <DataProvider
                getData={() => {
                    return getDeviceGroup().then(data => updateState(data));
                }}
                renderKey={props.location.pathname}
                renderData={() => (
                    <HeadingLevel>
                        <div className="space-between">
                            <Button
                                $as={Link}
                                kind={KIND.minimal}
                                to={allDeviceGroupsPath}
                                aria-label="Go back to all device groups"
                            >
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </Button>
                            <Heading>
                                {blankDeviceGroup
                                    ? "Create device group"
                                    : "Edit device group"}
                            </Heading>
                            <div>
                                {blankDeviceGroup ? null : (
                                    <ConfirmModal
                                        buttonText="Delete"
                                        title="Confirm Deletion"
                                        mainText={
                                            <>
                                                <div>
                                                    Are you sure you want to
                                                    delete this device group?
                                                </div>
                                                <div>
                                                    This action can't be undone.
                                                </div>
                                            </>
                                        }
                                        primaryAction={deleteDeviceGroup}
                                        primaryActionText="Delete"
                                        secondaryActionText="Cancel"
                                    />
                                )}
                                <Button
                                    onClick={saveDeviceGroup}
                                    disabled={identicalObject(
                                        deviceGroup,
                                        updatedDeviceGroup,
                                    )}
                                >
                                    {blankDeviceGroup ? "Create" : "Save"}
                                </Button>
                            </div>
                        </div>
                        <FormControl
                            label="Name"
                            key={`form-control-name`}
                            caption="required"
                            error={
                                deviceGroupErrors.name
                                    ? `Name ${deviceGroupErrors.name}`
                                    : ""
                            }
                        >
                            <Input
                                id={`input-name`}
                                value={updatedDeviceGroup.name || ""}
                                onChange={event =>
                                    setValue("name", event.currentTarget.value)
                                }
                                error={deviceGroupErrors.name}
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
                    </HeadingLevel>
                )}
            />
        </div>
    );
};

export { DeviceGroup };
