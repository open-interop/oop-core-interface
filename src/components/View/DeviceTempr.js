import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Select } from "baseui/select";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import ArrowLeft from "baseui/icon/arrow-left";
import {
    clearToast,
    ErrorToast,
    HttpTemprTemplate,
    SuccessToast,
} from "../Global";
import { AccordionWithCaption, DataProvider } from "../Universal";
import { identicalObject } from "../../Utilities";
import OopCore from "../../OopCore";

const DeviceTempr = props => {
    const [deviceTempr, setDeviceTempr] = useState({});
    const [updatedDeviceTempr, setUpdatedDeviceTempr] = useState({});
    const [deviceTemprErrors, setDeviceTemprErrors] = useState({});
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
            identicalObject(headers, updatedHeaders) &&
            identicalObject(restOfOptions, restOfUpdatedOptions) &&
            identicalObject(restOfTempr, updatedRestOfTempr)
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
                            caption="required"
                            error={
                                deviceTemprErrors.name
                                    ? `Name ${deviceTemprErrors.name}`
                                    : ""
                            }
                        >
                            <Input
                                id={"input-name"}
                                value={updatedDeviceTempr.name || ""}
                                onChange={event =>
                                    setValue("name", event.currentTarget.value)
                                }
                                error={deviceTemprErrors.name}
                            />
                        </FormControl>
                        <FormControl
                            label="Device"
                            key={"form-control-group-device"}
                            caption="required"
                        >
                            <Select
                                options={devices}
                                labelKey="name"
                                valueKey="id"
                                searchable={false}
                                onChange={event => {
                                    event.value.length
                                        ? setValue(
                                              "deviceId",
                                              event.value[0].id,
                                          )
                                        : setValue("deviceId", null);
                                }}
                                value={devices.filter(
                                    item =>
                                        item.id === updatedDeviceTempr.deviceId,
                                )}
                                clearable={false}
                            />
                        </FormControl>
                        <FormControl
                            label="Tempr"
                            key={"form-control-group-tempr"}
                            caption="required"
                        >
                            <Select
                                options={temprs}
                                labelKey="name"
                                valueKey="id"
                                searchable={false}
                                onChange={event => {
                                    event.value.length
                                        ? setValue("temprId", event.value[0].id)
                                        : setValue("temprId", null);
                                }}
                                value={temprs.filter(
                                    item =>
                                        item.id === updatedDeviceTempr.temprId,
                                )}
                                clearable={false}
                            />
                        </FormControl>
                        <FormControl
                            label="Endpoint type"
                            key={"form-control-group-endpoint-type"}
                            caption="required"
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
                                checkmarkType={STYLE_TYPE.toggle_round}
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
                        <AccordionWithCaption
                            title="Options"
                            caption="required"
                            error={deviceTemprErrors.base}
                            subtitle="Please provide a host, port, path, protocol and request method"
                        >
                            <div className="content-wrapper">
                                {updatedDeviceTempr.endpointType === "http" && (
                                    <HttpTemprTemplate
                                        template={updatedDeviceTempr.options}
                                        updateTemplate={options =>
                                            setValue("options", options)
                                        }
                                        error={deviceTemprErrors.base}
                                    />
                                )}
                            </div>
                        </AccordionWithCaption>
                        <Button
                            onClick={() => {
                                clearToast();
                                setDeviceTemprErrors({});
                                if (blankDeviceTempr) {
                                    return OopCore.createDeviceTempr(
                                        props.match.params.deviceGroupId,
                                        updatedDeviceTempr,
                                    )
                                        .then(response => {
                                            SuccessToast(
                                                "Created new device tempr",
                                                "Success",
                                            );
                                            refreshDeviceTempr(response);
                                            props.history.replace(
                                                `${allDeviceTemprsPath}/${response.id}`,
                                            );
                                        })
                                        .catch(err => {
                                            setDeviceTemprErrors(err);
                                            ErrorToast(
                                                "Failed to create device tempr",
                                                "Error",
                                            );
                                        });
                                } else {
                                    return OopCore.updateDeviceTempr(
                                        props.match.params.deviceGroupId,
                                        props.match.params.deviceTemprId,
                                        updatedDeviceTempr,
                                    )
                                        .then(response => {
                                            SuccessToast(
                                                "Updated device tempr",
                                                "Success",
                                            );
                                            refreshDeviceTempr(response);
                                        })
                                        .catch(err => {
                                            setDeviceTemprErrors(err);
                                            ErrorToast(
                                                "Failed to update device tempr",
                                                "Error",
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
