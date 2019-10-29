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
                  authenticationHeaders: [],
                  authenticationPath: "",
                  authenticationQuery: [],
                  deviceGroupId: "",
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
        setMoveGroupError("");
        if (blankDevice) {
            return Promise.resolve(true);
        } else {
            return OopCore.getDeviceTemprs(updatedDevice.deviceGroupId, {
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
            !updatedDevice.authenticationPath &&
            (updatedDevice.authenticationQuery &&
                !updatedDevice.authenticationQuery.find(
                    item => item[0] && item[1],
                )) &&
            (updatedDevice.authenticationHeaders &&
                !updatedDevice.authenticationHeaders.find(
                    item => item[0] && item[1],
                ))
        );
    };

    const identicalObject = (oldObject, newObject) => {
        return Object.keys(oldObject).every(
            key => oldObject[key] === newObject[key],
        );
    };

    const identicalArray = (oldArray, updatedArray) => {
        if (oldArray.length !== updatedArray.length) {
            return false;
        }

        var i = 0;
        var foundDifferentValue = false;
        while (i < oldArray.length && !foundDifferentValue) {
            if (Array.isArray(oldArray[i])) {
                if (identicalArray(oldArray[i], updatedArray[i])) {
                    i++;
                } else {
                    foundDifferentValue = true;
                }
            } else {
                if (oldArray[i] !== updatedArray[i]) {
                    foundDifferentValue = true;
                } else {
                }
                i++;
            }
        }

        return !foundDifferentValue;
    };

    const saveDisabled = () => {
        const { authenticationHeaders, authenticationQuery, ...rest } = device;
        const {
            authenticationHeaders: updatedHeaders,
            authenticationQuery: updatedQuery,
            ...updatedRest
        } = updatedDevice;
        return (
            noAuthentication() ||
            !updatedDevice.name ||
            !updatedDevice.deviceGroupId ||
            !updatedDevice.siteId ||
            (identicalArray(authenticationHeaders, updatedHeaders) &&
                identicalArray(authenticationQuery, updatedQuery) &&
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
                                    setValue("siteId", event.value[0].id)
                                }
                                value={sites.find(
                                    item => item.id === updatedDevice.siteId,
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
                                                "deviceGroupId",
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
                                        item.id === updatedDevice.deviceGroupId,
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
                                    setValue("timeZone", event.value[0].id)
                                }
                                value={timezones.find(
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
                                                updatedDevice.authenticationHeaders
                                            }
                                            updateData={data =>
                                                setValue(
                                                    "authenticationHeaders",
                                                    data,
                                                )
                                            }
                                            refreshKey={updatedDevice.updatedAt}
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
                                                updatedDevice.authenticationQuery
                                            }
                                            updateData={data =>
                                                setValue(
                                                    "authenticationQuery",
                                                    data,
                                                )
                                            }
                                            refreshKey={updatedDevice.updatedAt}
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
                                    to={`/device-groups/${updatedDevice.deviceGroupId}/device-temprs?deviceId=${updatedDevice.id}`}
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
                                    return OopCore.createDevice(updatedDevice)
                                        .then(response => {
                                            refreshDevice(response);
                                            props.history.replace(
                                                `${allDevicesPath}/${response.id}`,
                                            );
                                        })
                                        .catch(error => {
                                            console.error(error);
                                            setError(
                                                "Something went wrong while attepting to save device details",
                                            );
                                        });
                                } else {
                                    return OopCore.updateDevice(updatedDevice)
                                        .then(response =>
                                            refreshDevice(response),
                                        )
                                        .catch(error => {
                                            console.error(error);
                                            setError(
                                                "Something went wrong while attepting to save device details",
                                            );
                                        });
                                }
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
