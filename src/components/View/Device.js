import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQueryParam, NumberParam } from "use-query-params";
import { Button, KIND } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Select } from "baseui/select";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faExternalLinkAlt,
    faCheck,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { clearToast, ErrorToast, PairInput, SuccessToast } from "../Global";
import {
    AccordionWithCaption,
    ConfirmModal,
    DataProvider,
    IconSpinner,
    Pagination,
    Table,
} from "../Universal";
import OopCore from "../../OopCore";
import {
    arrayToObject,
    identicalArray,
    identicalObject,
} from "../../Utilities";

import TemprAssociator from "../Global/TemprAssociator";

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

    const [relations, setRelations] = useState([]);

    useEffect(() => {
        document.title = blankDevice
            ? "New Device | Open Interop"
            : "Edit Device | Open Interop";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            getDeviceTemprData(),
        ]).then(([deviceDetails, sites, groups, deviceTemprs]) => {
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

    const deviceDashboardPath = props.location.pathname.substr(
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

    const toggleDeviceTempr = tempr => {
        deviceErrors.deviceTemprs = "";

        if (tempr.selected) {
        } else {
        }
    };

    const getDeviceTemprData = () => {
        if (blankDevice) {
            return [];
        }

        return OopCore.getDeviceTemprs({
            deviceId: props.match.params.deviceId,
            pageSize: -1,
        })
        .then(deviceTemprs => {
            setRelations(deviceTemprs.data);
        });
    };

    const deleteDevice = () => {
        return OopCore.deleteDevice(updatedDevice.id)
            .then(() => {
                props.history.replace(`/devices`);
                SuccessToast("Deleted device", "Success");
            })
            .catch(error => {
                console.error(error);
                ErrorToast("Could not delete device", "Error");
            });
    };

    const saveDevice = () => {
        clearToast();
        setDeviceErrors({});
        if (blankDevice) {
            return OopCore.createDevice(updatedDevice)
                .then(response => {
                    SuccessToast("Created new device", "Success");
                    refreshDevice(response);
                    props.history.replace(
                        `${deviceDashboardPath}/${response.id}`,
                    );
                })
                .catch(error => {
                    setDeviceErrors(error);
                    ErrorToast("Failed to create device", "Error");
                });
        } else {
            return OopCore.updateDevice(updatedDevice)
                .then(response => {
                    SuccessToast("Saved device details", "Success");
                    refreshDevice(response);
                })
                .catch(error => {
                    setDeviceErrors(error);
                    ErrorToast("Failed to update device", "Error");
                });
        }
    };

    return (
        <div className="content-wrapper">
            <DataProvider
                getData={() => {
                    return getData();
                }}
                renderKey={props.location.pathname}
                renderData={() => (
                    <>
                        <div className="space-between">
                            <Button
                                $as={Link}
                                kind={KIND.minimal}
                                to={
                                    props.location.prevPath ||
                                    deviceDashboardPath
                                }
                                aria-label={
                                    props.location.prevPath
                                        ? "Go back to devices"
                                        : "Go back to device dashboard"
                                }
                            >
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </Button>
                            <h2>
                                {blankDevice ? "Create Device" : "Edit Device"}
                            </h2>
                            <div>
                                {blankDevice ? null : (
                                    <ConfirmModal
                                        buttonText="Delete"
                                        title="Confirm Deletion"
                                        mainText={
                                            <>
                                                <div>
                                                    Are you sure you want to
                                                    delete this device?
                                                </div>
                                                <div>
                                                    This action can't be undone.
                                                </div>
                                            </>
                                        }
                                        primaryAction={deleteDevice}
                                        primaryActionText="Delete"
                                        secondaryActionText="Cancel"
                                    />
                                )}
                                <Button
                                    onClick={saveDevice}
                                    disabled={saveButtonDisabled()}
                                >
                                    {blankDevice ? "Create" : "Save"}
                                </Button>
                            </div>
                        </div>

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
                                deviceErrors.deviceGroup
                                    ? `Group ${deviceErrors.deviceGroup}`
                                    : ""
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
                                    if (event.value.length) {
                                        setValue(
                                            "deviceGroupId",
                                            event.value[0].id,
                                        );
                                    } else {
                                        setValue("deviceGroupId", null);
                                    }
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
                                checkmarkType={STYLE_TYPE.toggle_round}
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
                            startOpen={blankDevice}
                        >
                            <div className="content-wrapper">
                                <FormControl
                                    label="Authentication path"
                                    key={`form-control-authentication-path`}
                                    error={deviceErrors.authenticationPath}
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
                                    error={deviceErrors.authenticationHeaders}
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
                                    error={deviceErrors.authenticationQuery}
                                >
                                    <PairInput
                                        data={
                                            updatedDevice.authenticationQuery
                                                .length < 1
                                                ? [["", ""]]
                                                : updatedDevice.authenticationQuery
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
                        {!blankDevice && (
                            <TemprAssociator 
                                subtitle="Select temprs to associate with this device."
                                selected={relations}
                                filter={{ deviceGroupId: updatedDevice.deviceGroupId }}
                                onSelect={tempr => {
                                    return OopCore.createDeviceTempr({
                                        deviceId: updatedDevice.id,
                                        temprId: tempr.id,
                                    })
                                        .then(res => {
                                            setRelations([...relations, res]);
                                        })
                                        .catch(error => {
                                            deviceErrors.deviceTemprs = error.errors;
                                        });
                                }}
                                onDeselect={(tempr, rel) => {
                                    return OopCore.deleteDeviceTempr(
                                        rel.id,
                                        {
                                            deviceId: updatedDevice.id,
                                            temprId: tempr.id,
                                        }
                                    )
                                        .then(() => {
                                            setRelations(relations.filter(v => v.id !== rel.id));
                                        })
                                        .catch(error => {
                                            deviceErrors.deviceTemprs = error.errors;
                                        });
                                }}
                            />
                        )}
                    </>
                )}
            />
        </div>
    );
};

export { Device };
