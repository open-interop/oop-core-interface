import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Select } from "baseui/select";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import { DataProvider, Error } from "../Universal";
import OopCore from "../../OopCore";
import { Timezones } from "../../resources/Timezones";

const Device = props => {
    const [device, setDevice] = useState({});
    const [updatedDevice, setUpdatedDevice] = useState({});
    const [stateSites, setSites] = useState([]);
    const [stateGroups, setGroups] = useState([]);
    const [error, setError] = useState("");
    const [moveGroupError, setMoveGroupError] = useState("");

    const getFormData = (deviceDetails, sites, groups) => {
        deviceDetails.sites = sites.data;
        deviceDetails.groups = groups.data;
        deviceDetails.timezones = Timezones.map(timezone => {
            return {
                id: timezone,
                name: timezone,
            };
        });
        return deviceDetails;
    };

    const getData = () => {
        return Promise.all([
            OopCore.getDevice(props.match.params.deviceId),
            OopCore.getSites(),
            OopCore.getDeviceGroups(),
        ]).then(([deviceDetails, sites, groups]) => {
            setSites(sites);
            setGroups(groups);
            return getFormData(deviceDetails, sites, groups);
        });
    };

    const updateState = response => {
        setDevice(response);
        setUpdatedDevice(response);
        return response;
    };

    const setValue = (key, value) => {
        const updatedData = { ...updatedDevice };
        updatedData[key] = value;
        setUpdatedDevice(updatedData);
    };

    const canMoveDevice = () => {
        setMoveGroupError("");
        return OopCore.getDeviceTemprs(updatedDevice.device_group_id, {
            deviceId: updatedDevice.id,
        }).then(response => {
            if (response.data.length) {
                return false;
            } else {
                return true;
            }
        });
    };

    return (
        <div className="content-wrapper">
            <DataProvider
                getData={() => {
                    return getData().then(data => updateState(data));
                }}
                renderData={() => (
                    <>
                        <FormControl label="Name" key={`form-control-name`}>
                            <Input
                                id={`input-name`}
                                value={updatedDevice.name}
                                onChange={event =>
                                    setValue("name", event.currentTarget.value)
                                }
                            />
                        </FormControl>
                        <FormControl label="Site" key={`form-control-site`}>
                            <Select
                                options={updatedDevice.sites}
                                labelKey="name"
                                valueKey="id"
                                searchable={false}
                                onChange={event =>
                                    setValue("site_id", event.value[0].id)
                                }
                                value={updatedDevice.sites.find(
                                    item => item.id === updatedDevice.site_id,
                                )}
                            />
                        </FormControl>
                        <FormControl
                            label="Group"
                            key={`form-control-group`}
                            error={moveGroupError}
                        >
                            <Select
                                options={updatedDevice.groups}
                                labelKey="name"
                                valueKey="id"
                                searchable={false}
                                onChange={event => {
                                    canMoveDevice().then(result => {
                                        if (result) {
                                            setValue(
                                                "device_group_id",
                                                event.value[0].id,
                                            );
                                        } else {
                                            setMoveGroupError(
                                                "This tempr can't be moved to another group because it's currently used in a device tempr",
                                            );
                                        }
                                    });
                                }}
                                value={updatedDevice.sites.find(
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
                                options={updatedDevice.timezones}
                                labelKey="name"
                                valueKey="id"
                                searchable={true}
                                onChange={event =>
                                    setValue("time_zone", event.value[0].id)
                                }
                                value={updatedDevice.timezones.find(
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
                                value={updatedDevice.latitude}
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
                                value={updatedDevice.longitude}
                                onChange={event =>
                                    setValue(
                                        "longitude",
                                        event.currentTarget.value,
                                    )
                                }
                            />
                        </FormControl>
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
                        <Button
                            onClick={() => {
                                const {
                                    sites,
                                    groups,
                                    ...device
                                } = updatedDevice;
                                setError("");
                                OopCore.updateDevice(device)
                                    .then(response =>
                                        updateState(
                                            getFormData(
                                                response,
                                                stateSites,
                                                stateGroups,
                                            ),
                                        ),
                                    )
                                    .catch(error => {
                                        console.error(error);
                                        setError(
                                            "Something went wrong while attepting to save device details",
                                        );
                                    });
                            }}
                            disabled={Object.keys(device).every(
                                key => device[key] === updatedDevice[key],
                            )}
                        >
                            {"Save"}
                        </Button>
                        <Error message={error} />
                    </>
                )}
            />
        </div>
    );
};

export { Device };
