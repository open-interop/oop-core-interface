import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AceEditor from "react-ace";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Select } from "baseui/select";
import ArrowLeft from "baseui/icon/arrow-left";
import { AccordionWithCaption, DataProvider } from "../Universal";
import {
    DeviceTemprPicker,
    clearToast,
    ErrorToast,
    HttpTemprTemplate,
    SuccessToast,
} from "../Global";
import { identicalObject } from "../../Utilities";
import OopCore from "../../OopCore";

import "brace/mode/json";
import "brace/theme/github";

const Tempr = props => {
    const [tempr, setTempr] = useState({});
    const [updatedTempr, setUpdatedTempr] = useState({});
    const [temprErrors, setTemprErrors] = useState({});
    const [groups, setGroups] = useState([]);
    const [availableDevices, setAvailableDevices] = useState([]);
    const [deviceTemprs, setDeviceTemprs] = useState([]);
    const [devicesPage, setDevicesPage] = useState(1);
    const [devicesPageSize, setDevicesPageSize] = useState(10);
    const [latestChanged, setLatestChanged] = useState(false);

    const [deviceFilterId, setDeviceFilterId] = useState("");
    const [deviceFilterName, setDeviceFilterName] = useState("");
    const [deviceFilterSelected, setDeviceFilterSelected] = useState("");

    const blankTempr = props.match.params.temprId === "new";

    useEffect(() => {
        setDevicesPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [devicesPageSize]);

    const getTempr = () => {
        return blankTempr
            ? Promise.resolve({
                  name: "",
                  description: "",
                  deviceGroupId: Number(props.match.params.deviceGroupId),
                  body: {
                      language: "js",
                      script: "",
                  },
                  template: {
                      headers: {},
                      host: "",
                      path: "",
                      port: 0,
                      protocol: "",
                      requestMethod: "",
                  },
              })
            : OopCore.getTempr(props.match.params.temprId);
    };

    const getData = () => {
        return Promise.all([getTempr(), OopCore.getDeviceGroups()]).then(
            ([tempr, groups]) => {
                refreshTempr(tempr);
                setGroups(groups.data);
                return tempr;
            },
        );
    };

    const refreshTempr = response => {
        setTempr(response);
        setUpdatedTempr(response);
    };

    const allTemprsPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    const setValue = (key, value) => {
        const updatedData = { ...updatedTempr };
        updatedData[key] = value;
        setUpdatedTempr(updatedData);
    };

    const saveButtonDisabled = () => {
        const { body, template, ...restOfTempr } = tempr;
        const {
            body: updatedBody,
            template: updatedTemplate,
            ...restOfUpdatedTempr
        } = updatedTempr;

        return (
            identicalObject(body, updatedBody) &&
            identicalObject(template, updatedTemplate) &&
            identicalObject(restOfTempr, restOfUpdatedTempr)
        );
    };

    const toggleDeviceTempr = deviceId => {
        const deviceTempr = deviceTemprs.data.find(
            deviceTempr => deviceTempr.deviceId === deviceId,
        );
        if (deviceTempr) {
            setLatestChanged(deviceId, false);
            return OopCore.deleteDeviceTempr(deviceTempr.id, {
                deviceId: deviceId,
                temprId: updatedTempr.id,
            }).then(() => getDeviceTemprData());
        } else {
            setLatestChanged(deviceId, true);
            return OopCore.createDeviceTempr({
                deviceId: deviceId,
                temprId: updatedTempr.id,
            }).then(() => getDeviceTemprData());
        }
    };

    const getDeviceTemprData = () => {
        return Promise.all([
            OopCore.getDevices({
                groupId: updatedTempr.groupId,
                pageSize: devicesPageSize,
                page: devicesPage,
                id: deviceFilterId,
                name: deviceFilterName,
            }),
            OopCore.getDeviceTemprs({ temprId: props.match.params.temprId }),
        ]).then(([availableDevices, deviceTemprs]) => {
            availableDevices.data.forEach(
                device =>
                    (device.selected =
                        deviceTemprs.data.find(
                            deviceTempr => deviceTempr.deviceId === device.id,
                        ) !== undefined),
            );

            if (deviceFilterSelected === true) {
                availableDevices.data = availableDevices.data.filter(
                    device => device.selected,
                );
                setAvailableDevices(availableDevices);
            } else if (deviceFilterSelected === false) {
                availableDevices.data = availableDevices.data.filter(
                    device => !device.selected,
                );
                setAvailableDevices(availableDevices);
            } else {
                setAvailableDevices(availableDevices);
            }
            setDeviceTemprs(deviceTemprs);
        });
    };

    return (
        <div className="content-wrapper">
            <Button $as={Link} to={allTemprsPath}>
                <ArrowLeft size={24} />
            </Button>

            <h2>{blankTempr ? "Create Tempr" : "Edit Tempr"}</h2>
            <DataProvider
                getData={() => {
                    return getData();
                }}
                renderData={() => (
                    <>
                        <FormControl
                            label="Name"
                            key={"form-control-group-name"}
                            error={
                                temprErrors.name
                                    ? `Name ${temprErrors.name}`
                                    : ""
                            }
                            caption="required"
                        >
                            <Input
                                id={"input-name"}
                                value={updatedTempr.name || ""}
                                onChange={event =>
                                    setValue("name", event.currentTarget.value)
                                }
                                error={temprErrors.name}
                            />
                        </FormControl>
                        <FormControl
                            label="Group"
                            key={"form-control-group-group"}
                            error={temprErrors.deviceGroup}
                            caption="required"
                        >
                            <Select
                                options={groups}
                                labelKey="name"
                                valueKey="id"
                                searchable={false}
                                clearable={false}
                                onChange={event => {
                                    setValue(
                                        "deviceGroupId",
                                        event.value[0].id,
                                    );
                                }}
                                value={groups.filter(
                                    item =>
                                        item.id === updatedTempr.deviceGroupId,
                                )}
                                error={temprErrors.deviceGroup}
                            />
                        </FormControl>
                        <FormControl
                            label="Description"
                            key={"form-control-group-description"}
                        >
                            <Input
                                id={"input-description"}
                                value={updatedTempr.description || ""}
                                onChange={event =>
                                    setValue(
                                        "description",
                                        event.currentTarget.value,
                                    )
                                }
                            />
                        </FormControl>
                        <AccordionWithCaption
                            title="Template"
                            caption="required"
                            error={temprErrors.base}
                            subtitle="Please provide a host, port, path, protocol and request method"
                        >
                            <div className="content-wrapper">
                                <HttpTemprTemplate
                                    template={updatedTempr.template}
                                    updateTemplate={value =>
                                        setValue("template", value)
                                    }
                                    error={temprErrors.base}
                                />
                            </div>
                        </AccordionWithCaption>
                        <AccordionWithCaption title="Body">
                            <div className="one-row">
                                <div>
                                    <label>Example</label>
                                    <AceEditor
                                        name="test"
                                        mode="json"
                                        theme="github"
                                        onChange={value => {
                                            setValue(
                                                "exampleTransmissionBody",
                                                value,
                                            );
                                        }}
                                        editorProps={{ $blockScrolling: true }}
                                        value={
                                            updatedTempr.exampleTransmissionBody
                                        }
                                    />
                                </div>
                                <div>
                                    <label>Mapping</label>
                                    <AceEditor
                                        mode="json"
                                        theme="github"
                                        onChange={value =>
                                            setValue("body", {
                                                language: "js",
                                                script: value,
                                            })
                                        }
                                        editorProps={{ $blockScrolling: true }}
                                        value={updatedTempr.body.script}
                                    />
                                </div>
                                <div>
                                    <label>Output</label>
                                    <AceEditor
                                        mode="json"
                                        theme="github"
                                        editorProps={{ $blockScrolling: true }}
                                        defaultValue={
                                            updatedTempr.outputTransmissionBody
                                        }
                                        readOnly
                                    />
                                </div>
                            </div>
                        </AccordionWithCaption>
                        <AccordionWithCaption
                            title="Device associations "
                            subtitle="Select devices to associate with this tempr"
                        >
                            <DataProvider
                                getData={() => {
                                    return getDeviceTemprData();
                                }}
                                renderKey={
                                    devicesPage +
                                    devicesPageSize +
                                    latestChanged +
                                    deviceFilterId +
                                    deviceFilterName +
                                    deviceFilterSelected
                                }
                                renderData={() => (
                                    <DeviceTemprPicker
                                        items={availableDevices}
                                        selectedItems={deviceTemprs}
                                        toggleItem={toggleDeviceTempr}
                                        page={devicesPage}
                                        setPage={setDevicesPage}
                                        pageSize={devicesPageSize}
                                        setPageSize={setDevicesPageSize}
                                        filters={{
                                            id: deviceFilterId,
                                            name: deviceFilterName,
                                            selected: deviceFilterSelected,
                                        }}
                                        updateFilters={(key, value) => {
                                            switch (key) {
                                                case "id":
                                                    return setDeviceFilterId(
                                                        value,
                                                    );
                                                case "name":
                                                    return setDeviceFilterName(
                                                        value,
                                                    );
                                                case "selected":
                                                    if (value === null) {
                                                        return setDeviceFilterSelected(
                                                            "",
                                                        );
                                                    }
                                                    return setDeviceFilterSelected(
                                                        value,
                                                    );

                                                default:
                                                    return null;
                                            }
                                        }}
                                    />
                                )}
                            />
                        </AccordionWithCaption>
                        <Button
                            onClick={() => {
                                clearToast();
                                setTemprErrors({});
                                if (blankTempr) {
                                    return OopCore.createTempr(updatedTempr)
                                        .then(response => {
                                            SuccessToast(
                                                "Created new tempr",
                                                "Success",
                                            );
                                            refreshTempr(response);
                                            props.history.replace(
                                                `/temprs/${response.id}`,
                                            );
                                        })
                                        .catch(error => {
                                            setTemprErrors(error);
                                            ErrorToast(
                                                "Failed to create tempr",
                                                "Error",
                                            );
                                        });
                                } else {
                                    OopCore.updateTempr(
                                        props.match.params.temprId,
                                        updatedTempr,
                                    )
                                        .then(response => {
                                            refreshTempr(response);
                                            SuccessToast(
                                                "Updated tempr",
                                                "Success",
                                            );
                                        })
                                        .catch(error => {
                                            setTemprErrors(error);
                                            ErrorToast(
                                                "Failed to update tempr",
                                                "Error",
                                            );
                                        });
                                }
                            }}
                            disabled={saveButtonDisabled()}
                        >
                            {blankTempr ? "Create" : "Save"}
                        </Button>
                        {props.error && <div>{props.error}</div>}
                    </>
                )}
            />
        </div>
    );
};

export { Tempr };
