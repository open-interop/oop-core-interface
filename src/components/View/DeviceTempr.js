import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Select } from "baseui/select";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import ArrowLeft from "baseui/icon/arrow-left";
import { DataProvider, Error } from "../Universal";
import { Template } from "../Global";
import OopCore from "../../OopCore";

const DeviceTempr = props => {
    const [deviceTempr, setDeviceTempr] = useState({});
    const [updatedDeviceTempr, setUpdatedDeviceTempr] = useState({});
    const [devices, setDevices] = useState([]);
    const [temprs, setTemprs] = useState([]);
    const blankDeviceTempr = props.match.params.deviceTemprId === "new";
    const [error, setError] = useState("");

    const getDeviceTempr = () => {
        return blankDeviceTempr
            ? Promise.resolve({
                  deviceId: null,
                  endpointType: "http",
                  temprId: null,
                  template: {
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
        return Object.keys(oldObject).every(
            key => oldObject[key] === updatedObject[key],
        );
    };

    const saveButtonDisabled = () => {
        const { template, ...restOfTempr } = deviceTempr;
        const {
            template: updatedTemplate,
            ...updatedRestOfTempr
        } = updatedDeviceTempr;

        const { headers, ...restOfTemplate } = template;
        const {
            headers: updatedHeaders,
            ...restOfUpdatedTemplate
        } = updatedTemplate;

        if (blankDeviceTempr) {
            return false;
        } else {
            return (
                identical(headers, updatedHeaders) &&
                identical(restOfTemplate, restOfUpdatedTemplate) &&
                identical(restOfTempr, updatedRestOfTempr)
            );
        }
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
                            <Template
                                endpointType={updatedDeviceTempr.endpointType}
                                template={updatedDeviceTempr.template}
                                updateTemplate={template =>
                                    setValue("template", template)
                                }
                            />
                        </FormControl>
                        <Button
                            onClick={() => {
                                setError("");
                                if (blankDeviceTempr) {
                                    return OopCore.createDeviceTempr(
                                        props.match.params.deviceGroupId,
                                        updatedDeviceTempr,
                                    )
                                        .then(response => {
                                            refreshDeviceTempr(response);
                                            props.history.replace(
                                                `${allDeviceTemprsPath}/${response.id}`,
                                            );
                                        })
                                        .catch(err => {
                                            console.error(err);
                                            setError(
                                                "Something went wrong while saving device tempr",
                                            );
                                        });
                                } else {
                                    return OopCore.updateDeviceTempr(
                                        props.match.params.deviceGroupId,
                                        props.match.params.deviceTemprId,
                                        updatedDeviceTempr,
                                    )
                                        .then(response => {
                                            refreshDeviceTempr(response);
                                        })
                                        .catch(err => {
                                            console.error(err);
                                            setError(
                                                "Something went wrong while saving device tempr",
                                            );
                                        });
                                }
                            }}
                            disabled={saveButtonDisabled()}
                        >
                            {blankDeviceTempr ? "Create" : "Save"}
                        </Button>
                        <Error message={error} />
                    </>
                )}
            />
        </div>
    );
};

export { DeviceTempr };
