import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Select } from "baseui/select";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import ArrowLeft from "baseui/icon/arrow-left";
import { DataProvider } from "../Universal";
import { HttpTemprTemplate } from "../Global";
import toastr from "toastr";
import OopCore from "../../OopCore";

const DeviceTempr = props => {
    const [deviceTempr, setDeviceTempr] = useState({});
    const [updatedDeviceTempr, setUpdatedDeviceTempr] = useState({});
    const [devices, setDevices] = useState([]);
    const [temprs, setTemprs] = useState([]);
    const blankDeviceTempr = props.match.params.deviceTemprId === "new";

    const getDeviceTempr = () => {
        return blankDeviceTempr
            ? Promise.resolve({
                  name: "",
                  deviceId: null,
                  queueResponse: false,
                  endpointType: "http",
                  temprId: null,
                  options: {
                      headers: {},
                      host: "",
                      path: "",
                      port: 0,
                      protocol: "",
                      requestMethod: "",
                  },
              })
            : OopCore.getDeviceTempr(
                  props.match.params.deviceGroupId,
                  props.match.params.deviceTemprId,
              );
    };

    const getData = () => {
        return Promise.all([
            getDeviceTempr(),
            OopCore.getDevices(),
            OopCore.getTemprs(props.match.params.deviceGroupId),
        ]).then(([tempr, devices, temprs]) => {
            const devicesForThisGroup = devices.data.filter(
                device =>
                    device.deviceGroupId ===
                    Number(props.match.params.deviceGroupId),
            );
            setDevices(devicesForThisGroup);
            setTemprs(temprs.data);
            setDeviceTempr(tempr);
            setUpdatedDeviceTempr(tempr);
            return tempr;
        });
    };

    const refreshDeviceTempr = tempr => {
        setDeviceTempr(tempr);
        setUpdatedDeviceTempr(tempr);
    };

    const allDeviceTemprsPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    const setValue = (key, value) => {
        const updatedData = { ...updatedDeviceTempr };
        updatedData[key] = value;
        setUpdatedDeviceTempr(updatedData);
    };

    const identical = (oldObject, updatedObject) => {
        if (
            Object.keys(oldObject).length !== Object.keys(updatedObject).length
        ) {
            return false;
        }
        return Object.keys(oldObject).every(
            key => oldObject[key] === updatedObject[key],
        );
    };

    const saveButtonDisabled = () => {
        const { options, ...restOfTempr } = deviceTempr;
        const {
            options: updatedOptions,
            ...updatedRestOfTempr
        } = updatedDeviceTempr;

        const { headers, ...restOfOptions } = options;
        const {
            headers: updatedHeaders,
            ...restOfUpdatedOptions
        } = updatedOptions;

        return (
            !updatedDeviceTempr.name ||
            !updatedDeviceTempr.deviceId ||
            !updatedDeviceTempr.temprId ||
            !updatedDeviceTempr.endpointType ||
            !updatedDeviceTempr.options.host ||
            !updatedDeviceTempr.options.path ||
            !updatedDeviceTempr.options.port ||
            !updatedDeviceTempr.options.protocol ||
            !updatedDeviceTempr.options.requestMethod ||
            (identical(headers, updatedHeaders) &&
                identical(restOfOptions, restOfUpdatedOptions) &&
                identical(restOfTempr, updatedRestOfTempr))
        );
    };

    return (
        <div className="content-wrapper">
            <Button $as={Link} to={allDeviceTemprsPath}>
                <ArrowLeft size={24} />
            </Button>
            <h2>
                {blankDeviceTempr ? "Create Device Tempr" : "Edit Device Tempr"}
            </h2>
            <DataProvider
                getData={() => {
                    return getData();
                }}
                renderData={() => (
                    <>
                        <FormControl
                            label="Name"
                            key={"form-control-group-name"}
                            required
                        >
                            <Input
                                id={"input-name"}
                                value={updatedDeviceTempr.name || ""}
                                onChange={event =>
                                    setValue("name", event.currentTarget.value)
                                }
                            />
                        </FormControl>
                        <FormControl
                            label="Device"
                            key={"form-control-group-device"}
                        >
                            <Select
                                options={devices}
                                labelKey="name"
                                valueKey="id"
                                searchable={false}
                                onChange={event => {
                                    setValue("deviceId", event.value[0].id);
                                }}
                                value={devices.find(
                                    item =>
                                        item.id === updatedDeviceTempr.deviceId,
                                )}
                            />
                        </FormControl>
                        <FormControl
                            label="Tempr"
                            key={"form-control-group-tempr"}
                        >
                            <Select
                                options={temprs}
                                labelKey="name"
                                valueKey="id"
                                searchable={false}
                                onChange={event => {
                                    setValue("temprId", event.value[0].id);
                                }}
                                value={temprs.find(
                                    item =>
                                        item.id === updatedDeviceTempr.temprId,
                                )}
                            />
                        </FormControl>
                        <FormControl
                            label="Endpoint type"
                            key={"form-control-group-endpoint-type"}
                        >
                            <Input
                                id={"input-endpoint-type"}
                                value={
                                    updatedDeviceTempr.endpointType || "http"
                                }
                                disabled
                            />
                        </FormControl>
                        <FormControl
                            label="Queue response"
                            key={`form-control-queue-response`}
                        >
                            <Checkbox
                                checked={updatedDeviceTempr.queueResponse}
                                onChange={() =>
                                    setValue(
                                        "queueResponse",
                                        !updatedDeviceTempr.queueResponse,
                                    )
                                }
                                checkmarkType={STYLE_TYPE.toggle}
                            />
                        </FormControl>
                        {!blankDeviceTempr && (
                            <FormControl
                                label="Last updated"
                                key={`form-control-queue-updated-at`}
                            >
                                <Input
                                    type="datetime-local"
                                    id={"input-updated"}
                                    value={updatedDeviceTempr.updatedAt}
                                    disabled
                                />
                            </FormControl>
                        )}
                        <FormControl>
                            <HttpTemprTemplate
                                endpointType={updatedDeviceTempr.endpointType}
                                template={updatedDeviceTempr.options}
                                updateTemplate={options =>
                                    setValue("options", options)
                                }
                            />
                        </FormControl>
                        <Button
                            onClick={() => {
                                toastr.clear();
                                if (blankDeviceTempr) {
                                    return OopCore.createDeviceTempr(
                                        props.match.params.deviceGroupId,
                                        updatedDeviceTempr,
                                    )
                                        .then(response => {
                                            toastr.success(
                                                "Created new device tempr",
                                                "Success",
                                                { timeOut: 5000 },
                                            );
                                            refreshDeviceTempr(response);
                                            props.history.replace(
                                                `${allDeviceTemprsPath}/${response.id}`,
                                            );
                                        })
                                        .catch(err => {
                                            console.error(err);
                                            toastr.error(
                                                "Something went wrong while creating device tempr",
                                                "Error",
                                                { timeOut: 5000 },
                                            );
                                        });
                                } else {
                                    return OopCore.updateDeviceTempr(
                                        props.match.params.deviceGroupId,
                                        props.match.params.deviceTemprId,
                                        updatedDeviceTempr,
                                    )
                                        .then(response => {
                                            toastr.success(
                                                "Updated device tempr",
                                                "Success",
                                                { timeOut: 5000 },
                                            );
                                            refreshDeviceTempr(response);
                                        })
                                        .catch(err => {
                                            console.error(err);
                                            toastr.error(
                                                "Something went wrong while updating device tempr",
                                                "Error",
                                                { timeOut: 5000 },
                                            );
                                        });
                                }
                            }}
                            disabled={saveButtonDisabled()}
                        >
                            {blankDeviceTempr ? "Create" : "Save"}
                        </Button>
                    </>
                )}
            />
        </div>
    );
};

export { DeviceTempr };
