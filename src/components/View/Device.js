/* eslint-disable camelcase */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Select } from "baseui/select";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import ArrowLeft from "baseui/icon/arrow-left";
import { Accordion, Panel } from "baseui/accordion";
import { PairInput } from "../Global";
import { DataProvider, Error } from "../Universal";
import OopCore from "../../OopCore";
import { Timezones } from "../../resources/Timezones";

const Device = props => {
    const [device, setDevice] = useState({});
    const [updatedDevice, setUpdatedDevice] = useState({});
    const [sites, setSites] = useState([]);
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState("");
    const [moveGroupError, setMoveGroupError] = useState("");
    const timezones = Timezones.map(timezone => {
        return {
            id: timezone,
            name: timezone,
        };
    });
    const blankDevice = props.match.params.deviceId === "new";

    const getDevice = () => {
        return blankDevice
            ? Promise.resolve({
                  active: false,
                  authentication_headers: [],
                  authentication_path: "",
                  authentication_query: [],
                  device_group_id: "",
                  latitude: "",
                  longitude: "",
                  name: "",
                  site_id: "",
                  time_zone: "",
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
                key === "authentication_headers" ||
                key === "authentication_query"
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
        setMoveGroupError("");
        if (blankDevice) {
            return Promise.resolve(true);
        } else {
            return OopCore.getDeviceTemprs(updatedDevice.device_group_id, {
                deviceId: updatedDevice.id,
            }).then(response => {
                if (response.data.length) {
                    return false;
                } else {
                    return true;
                }
            });
        }
    };

    const allDevicesPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    const noAuthentication = () => {
        return (
            !updatedDevice.authentication_path &&
            (updatedDevice.authentication_query &&
                !updatedDevice.authentication_query.find(
                    item => item[0] && item[1],
                )) &&
            (updatedDevice.authentication_headers &&
                !updatedDevice.authentication_headers.find(
                    item => item[0] && item[1],
                ))
        );
    };

    const identicalObject = (oldObject, newObject) => {
        return Object.keys(oldObject).every(
            key => oldObject[key] === newObject[key],
        );
    };

    const identicalArray = (oldArray, newArray) => {
        if (oldArray.length !== newArray.length) {
            return false;
        }
        for (var i = 0; i <= oldArray.length; i++) {
            if (Array.isArray(oldArray[i])) {
                return identicalArray(oldArray[i], newArray[i]);
            }
            if (oldArray[i] !== newArray[i]) {
                return false;
            }
        }
        return true;
    };

    const saveDisabled = () => {
        const {
            authentication_headers,
            authentication_query,
            ...rest
        } = device;
        const {
            authentication_headers: updated_headers,
            authentication_query: updated_query,
            ...updatedRest
        } = updatedDevice;
        return (
            noAuthentication() ||
            !updatedDevice.name ||
            !updatedDevice.device_group_id ||
            !updatedDevice.site_id ||
            (identicalArray(authentication_headers, updated_headers) &&
                identicalArray(authentication_query, updated_query) &&
                identicalObject(rest, updatedRest))
        );
    };

    return (
        <div className="content-wrapper">
            <Button $as={Link} to={allDevicesPath}>
                <ArrowLeft size={24} />
            </Button>
            <h2>{blankDevice ? "Create Device" : "Edit Device"}</h2>
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
                        >
                            <Input
                                required
                                id={`input-name`}
                                value={updatedDevice.name}
                                onChange={event =>
                                    setValue("name", event.currentTarget.value)
                                }
                            />
                        </FormControl>
                        <FormControl
                            label="Site"
                            key={`form-control-site`}
                            caption="required"
                        >
                            <Select
                                required
                                options={sites}
                                labelKey="name"
                                valueKey="id"
                                searchable={false}
                                onChange={event =>
                                    setValue("site_id", event.value[0].id)
                                }
                                value={sites.find(
                                    item => item.id === updatedDevice.site_id,
                                )}
                            />
                        </FormControl>
                        <FormControl
                            label="Group"
                            key={`form-control-group`}
                            error={moveGroupError}
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
                                            setValue(
                                                "device_group_id",
                                                event.value[0].id,
                                            );
                                        } else {
                                            setMoveGroupError(
                                                "This device can't be moved to another group because it's currently used in a device tempr",
                                            );
                                        }
                                    });
                                }}
                                value={groups.find(
                                    item =>
                                        item.id ===
                                        updatedDevice.device_group_id,
                                )}
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
                                onChange={event =>
                                    setValue("time_zone", event.value[0].id)
                                }
                                value={timezones.find(
                                    item => item.id === updatedDevice.time_zone,
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
                        <Accordion>
                            <Panel title="Authentication">
                                <div className="content-wrapper">
                                    <FormControl
                                        label="Authentication path"
                                        key={`form-control-authentication-path`}
                                        error={
                                            noAuthentication()
                                                ? "Please provide at least one form of authentication"
                                                : ""
                                        }
                                    >
                                        <Input
                                            id={`input-authentication-path`}
                                            value={
                                                updatedDevice.authentication_path ||
                                                ""
                                            }
                                            onChange={event =>
                                                setValue(
                                                    "authentication_path",
                                                    event.currentTarget.value ||
                                                        null,
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormControl
                                        label="Authentication headers"
                                        key={`form-control-authentication-headers`}
                                        error={
                                            noAuthentication()
                                                ? "Please provide at least one form of authentication"
                                                : ""
                                        }
                                    >
                                        <PairInput
                                            data={
                                                updatedDevice.authentication_headers
                                            }
                                            updateData={data =>
                                                setValue(
                                                    "authentication_headers",
                                                    data,
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormControl
                                        label="Authentication query"
                                        key={`form-control-authentication-query`}
                                        error={
                                            noAuthentication()
                                                ? "Please provide at least one form of authentication"
                                                : ""
                                        }
                                    >
                                        <PairInput
                                            data={
                                                updatedDevice.authentication_query
                                            }
                                            updateData={data =>
                                                setValue(
                                                    "authentication_query",
                                                    data,
                                                )
                                            }
                                        />
                                    </FormControl>
                                </div>
                            </Panel>
                        </Accordion>
                        {!blankDevice && (
                            <FormControl
                                label="Device Temprs"
                                key={`form-control-device-temprs`}
                            >
                                <Button
                                    $as={Link}
                                    to={`/device-groups/${updatedDevice.device_group_id}/device-temprs/?deviceId=${updatedDevice.id}`}
                                >
                                    Device Temprs
                                </Button>
                            </FormControl>
                        )}
                        <Button
                            onClick={() => {
                                setError("");
                                setMoveGroupError("");
                                if (blankDevice) {
                                    return OopCore.createDevice(
                                        updatedDevice,
                                    ).then(response => {
                                        refreshDevice(response);
                                        props.history.replace(
                                            `${allDevicesPath}/${response.id}`,
                                        );
                                    });
                                }
                                OopCore.updateDevice(updatedDevice)
                                    .then(response => refreshDevice(response))
                                    .catch(error => {
                                        console.error(error);
                                        setError(
                                            "Something went wrong while attepting to save device details",
                                        );
                                    });
                            }}
                            disabled={saveDisabled()}
                        >
                            {blankDevice ? "Create" : "Save"}
                        </Button>
                        <Error message={error} />
                    </>
                )}
            />
        </div>
    );
};

export { Device };
