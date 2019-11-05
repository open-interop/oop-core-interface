import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryParam, NumberParam } from "use-query-params";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Select } from "baseui/select";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import ArrowLeft from "baseui/icon/arrow-left";
import { clearToast, ErrorToast, PairInput, SuccessToast } from "../Global";
import { AccordionWithCaption, DataProvider } from "../Universal";
import OopCore from "../../OopCore";
import { identicalArray, identicalObject } from "../../Utilities";
import { Timezones } from "../../resources/Timezones";

const Device = props => {
    const [device, setDevice] = useState({});
    const [updatedDevice, setUpdatedDevice] = useState({});
    const [deviceErrors, setDeviceErrors] = useState({});
    const [sites, setSites] = useState([]);
    const [groups, setGroups] = useState([]);
    const timezones = Timezones.map(timezone => {
        return {
            id: timezone,
            name: timezone,
        };
    });
    const blankDevice = props.match.params.deviceId === "new";
    const queryParam = useQueryParam("deviceGroupId", NumberParam)[0];

    const getDevice = () => {
        return blankDevice
            ? Promise.resolve({
                  active: false,
                  authenticationHeaders: [],
                  authenticationPath: "",
                  authenticationQuery: [],
                  deviceGroupId: queryParam,
                  latitude: "",
                  longitude: "",
                  name: "",
                  siteId: "",
                  timeZone: "",
              })
            : OopCore.getDevice(props.match.params.deviceId);
    };

    const getData = () => {
        return Promise.all([
            getDevice(),
            OopCore.getSites(),
            OopCore.getDeviceGroups(),
        ]).then(([deviceDetails, sites, groups]) => {
            setSites(sites.data);
            setGroups(groups.data);
            refreshDevice(deviceDetails);
            return deviceDetails;
        });
    };

    const copyOfArray = original => {
        const copy = [];
        original.forEach((item, index) => {
            copy[index] = [...item];
        });

        return copy;
    };

    const refreshDevice = response => {
        setDevice(response);
        const copy = {};
        Object.keys(response).map(key => {
            if (
                key === "authenticationHeaders" ||
                key === "authenticationQuery"
            ) {
                return (copy[key] = copyOfArray(response[key]));
            } else {
                return (copy[key] = response[key]);
            }
        });
        setUpdatedDevice(copy);
        return response;
    };

    const setValue = (key, value) => {
        const updatedData = { ...updatedDevice };
        updatedData[key] = value;
        setUpdatedDevice(updatedData);
    };

    const canMoveDevice = () => {
        setDeviceErrors({ ...deviceErrors, moveGroupError: "" });
        if (blankDevice) {
            return Promise.resolve(true);
        } else {
            return OopCore.getDeviceTemprs(updatedDevice.deviceGroupId, {
                deviceId: updatedDevice.id,
            }).then(response => {
                if (response.data.length) {
                    setDeviceErrors({
                        moveGroupError:
                            "This device can't be moved to another group because it's currently used in a device tempr",
                    });
                    return false;
                } else {
                    setDeviceErrors({ ...deviceErrors, moveGroupError: "" });
                    return true;
                }
            });
        }
    };

    const allDevicesPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    const saveButtonDisabled = () => {
        const { authenticationHeaders, authenticationQuery, ...rest } = device;
        const {
            authenticationHeaders: updatedHeaders,
            authenticationQuery: updatedQuery,
            ...updatedRest
        } = updatedDevice;
        return (
            identicalArray(authenticationHeaders, updatedHeaders) &&
            identicalArray(authenticationQuery, updatedQuery) &&
            identicalObject(rest, updatedRest)
        );
    };

    return (
        <div className="content-wrapper">
            <Button $as={Link} to={allDevicesPath}>
                <ArrowLeft size={24} />
            </Button>
            <h2>{blankDevice ? "Create Device" : "Edit Device"}</h2>{" "}
            <DataProvider
                getData={() => {
                    return getData();
                }}
                renderKey={props.location.pathname}
                renderData={() => (
                    <>
                        <FormControl
                            label="Name"
                            key={`form-control-name`}
                            caption="required"
                            error={
                                deviceErrors.name
                                    ? `Name ${deviceErrors.name}`
                                    : ""
                            }
                        >
                            <Input
                                id={`input-name`}
                                value={updatedDevice.name}
                                onChange={event =>
                                    setValue("name", event.currentTarget.value)
                                }
                                error={deviceErrors.name}
                            />
                        </FormControl>
                        <FormControl
                            label="Site"
                            key={`form-control-site`}
                            caption="required"
                            error={
                                deviceErrors.site
                                    ? `Site ${deviceErrors.site}`
                                    : ""
                            }
                        >
                            <Select
                                required
                                options={sites}
                                labelKey="name"
                                valueKey="id"
                                searchable={false}
                                onChange={event => {
                                    event.value.length
                                        ? setValue("siteId", event.value[0].id)
                                        : setValue("siteId", null);
                                }}
                                value={sites.filter(
                                    item => item.id === updatedDevice.siteId,
                                )}
                                error={deviceErrors.site}
                            />
                        </FormControl>
                        <FormControl
                            label="Group"
                            key={`form-control-group`}
                            error={
                                deviceErrors.moveGroupError ||
                                (deviceErrors.deviceGroup
                                    ? `Group ${deviceErrors.deviceGroup}`
                                    : "")
                            }
                            caption="required"
                        >
                            <Select
                                required
                                options={groups}
                                labelKey="name"
                                valueKey="id"
                                searchable={false}
                                onChange={event => {
                                    canMoveDevice().then(canMove => {
                                        if (canMove) {
                                            event.value.length
                                                ? setValue(
                                                      "deviceGroupId",
                                                      event.value[0].id,
                                                  )
                                                : setValue(
                                                      "deviceGroupId",
                                                      null,
                                                  );
                                        }
                                    });
                                }}
                                value={groups.filter(
                                    item =>
                                        item.id === updatedDevice.deviceGroupId,
                                )}
                                error={deviceErrors.deviceGroup}
                            />
                        </FormControl>
                        <FormControl label="Active" key={`form-control-active`}>
                            <Checkbox
                                checked={updatedDevice.active}
                                onChange={() =>
                                    setValue("active", !updatedDevice.active)
                                }
                                checkmarkType={STYLE_TYPE.toggle}
                            />
                        </FormControl>
                        <FormControl
                            label="Timezone"
                            key={`form-control-timezone`}
                        >
                            <Select
                                options={timezones}
                                labelKey="name"
                                valueKey="id"
                                searchable={true}
                                onChange={event => {
                                    event.value.length
                                        ? setValue(
                                              "timeZone",
                                              event.value[0].id,
                                          )
                                        : setValue("timeZone", null);
                                }}
                                value={timezones.filter(
                                    item => item.id === updatedDevice.timeZone,
                                )}
                            />
                        </FormControl>
                        <FormControl
                            label="Latitude"
                            key={`form-control-latitude`}
                        >
                            <Input
                                id={`input-latitude`}
                                value={updatedDevice.latitude || ""}
                                onChange={event =>
                                    setValue(
                                        "latitude",
                                        event.currentTarget.value,
                                    )
                                }
                            />
                        </FormControl>
                        <FormControl
                            label="Longitude"
                            key={`form-control-longitude`}
                        >
                            <Input
                                id={`input-Longitude`}
                                value={updatedDevice.longitude || ""}
                                onChange={event =>
                                    setValue(
                                        "longitude",
                                        event.currentTarget.value,
                                    )
                                }
                            />
                        </FormControl>
                        <AccordionWithCaption
                            title="Authentication"
                            subtitle="Please provide at least one form of authentication"
                            error={deviceErrors.base}
                            caption="required"
                        >
                            <div className="content-wrapper">
                                <FormControl
                                    label="Authentication path"
                                    key={`form-control-authentication-path`}
                                >
                                    <Input
                                        id={`input-authentication-path`}
                                        value={
                                            updatedDevice.authenticationPath ||
                                            ""
                                        }
                                        onChange={event =>
                                            setValue(
                                                "authenticationPath",
                                                event.currentTarget.value ||
                                                    null,
                                            )
                                        }
                                        error={deviceErrors.base}
                                    />
                                </FormControl>
                                <FormControl
                                    label="Authentication headers"
                                    key={`form-control-authentication-headers`}
                                >
                                    <PairInput
                                        data={
                                            updatedDevice.authenticationHeaders
                                                .length < 1
                                                ? [["", ""]]
                                                : updatedDevice.authenticationHeaders
                                        }
                                        updateData={data => {
                                            if (
                                                identicalArray(data, [["", ""]])
                                            ) {
                                                setValue(
                                                    "authenticationHeaders",
                                                    [],
                                                );
                                            } else {
                                                setValue(
                                                    "authenticationHeaders",
                                                    data,
                                                );
                                            }
                                        }}
                                        refreshKey={updatedDevice.updatedAt}
                                        error={deviceErrors.base}
                                    />
                                </FormControl>
                                <FormControl
                                    label="Authentication query"
                                    key={`form-control-authentication-query`}
                                >
                                    <PairInput
                                        data={
                                            updatedDevice.authenticationQuery
                                                .length < 1
                                                ? [["", ""]]
                                                : updatedDevice.authenticationHeaders
                                        }
                                        updateData={data => {
                                            if (
                                                identicalArray(data, [["", ""]])
                                            ) {
                                                setValue(
                                                    "authenticationQuery",
                                                    [],
                                                );
                                            } else {
                                                setValue(
                                                    "authenticationQuery",
                                                    data,
                                                );
                                            }
                                        }}
                                        refreshKey={updatedDevice.updatedAt}
                                        error={deviceErrors.base}
                                    />
                                </FormControl>
                            </div>
                        </AccordionWithCaption>
                        <Button
                            onClick={() => {
                                clearToast();
                                setDeviceErrors({});
                                if (blankDevice) {
                                    return OopCore.createDevice(updatedDevice)
                                        .then(response => {
                                            SuccessToast(
                                                "Created new device",
                                                "Success",
                                            );
                                            refreshDevice(response);
                                            props.history.replace(
                                                `${allDevicesPath}/${response.id}`,
                                            );
                                        })
                                        .catch(error => {
                                            setDeviceErrors(error);
                                            ErrorToast(
                                                "Failed to create device",
                                                "Error",
                                            );
                                        });
                                } else {
                                    return OopCore.updateDevice(updatedDevice)
                                        .then(response => {
                                            SuccessToast(
                                                "Saved device details",
                                                "Success",
                                            );
                                            refreshDevice(response);
                                        })
                                        .catch(error => {
                                            setDeviceErrors(error);
                                            ErrorToast(
                                                "Failed to update device",
                                                "Error",
                                            );
                                        });
                                }
                            }}
                            disabled={saveButtonDisabled()}
                        >
                            {blankDevice ? "Create" : "Save"}
                        </Button>
                    </>
                )}
            />
        </div>
    );
};

export { Device };
