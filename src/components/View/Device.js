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
    const [availableTemprs, setAvailableTemprs] = useState([]);
    const [temprsPage, setTemprsPage] = useState(1);
    const [temprsPageSize, setTemprsPageSize] = useState(10);
    const [latestChanged, setLatestChanged] = useState(false);
    const [temprFilterId, setTemprFilterId] = useState("");
    const [temprFilterName, setTemprFilterName] = useState("");
    const [temprFilterSelected, setTemprFilterSelected] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = blankDevice
            ? "New Device | Open Interop"
            : "Edit Device | Open Interop";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        setTemprsPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [temprsPageSize, temprFilterId, temprFilterName, temprFilterSelected]);

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
        setLoading(tempr.id);
        deviceErrors.deviceTemprs = "";
        if (tempr.selected) {
            setLatestChanged(tempr.id, false);
            return OopCore.deleteDeviceTempr(tempr.selected.id, {
                deviceId: updatedDevice.id,
                temprId: tempr.id,
            })
                .then(() => {
                    setLoading(false);
                    getDeviceTemprData();
                })
                .catch(error => {
                    setLoading(false);
                    deviceErrors.deviceTemprs = error.errors;
                });
        } else {
            setLatestChanged(tempr.id, true);
            return OopCore.createDeviceTempr({
                deviceId: updatedDevice.id,
                temprId: tempr.id,
            })
                .then(() => {
                    setLoading(false);
                    getDeviceTemprData();
                })
                .catch(error => {
                    setLoading(false);
                    deviceErrors.deviceTemprs = error.errors;
                });
        }
    };

    const getDeviceTemprData = () => {
        return Promise.all([
            OopCore.getTemprs({
                deviceGroupId: updatedDevice.deviceGroupId,
                pageSize: temprsPageSize,
                page: temprsPage,
                id: temprFilterId,
                name: temprFilterName,
            }),
            OopCore.getDeviceTemprs({
                deviceId: props.match.params.deviceId,
                pageSize: -1,
            }),
        ]).then(([availableTemprs, deviceTemprs]) => {
            const deviceTemprsObject = arrayToObject(
                deviceTemprs.data,
                "temprId",
            );
            availableTemprs.data.forEach(tempr => {
                tempr.selected = deviceTemprsObject[tempr.id];
            });

            if (temprFilterSelected === true) {
                availableTemprs.data = availableTemprs.data.filter(
                    device => device.selected,
                );
                setAvailableTemprs(availableTemprs);
            } else if (temprFilterSelected === false) {
                availableTemprs.data = availableTemprs.data.filter(
                    device => !device.selected,
                );
                setAvailableTemprs(availableTemprs);
            } else {
                setAvailableTemprs(availableTemprs);
            }
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
                                to={deviceDashboardPath}
                                aria-label="Go back to device dashboard"
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
                        {!blankDevice && (
                            <AccordionWithCaption
                                title="Tempr associations "
                                subtitle="Select temprs to associate with this device"
                                error={deviceErrors.deviceTemprs}
                            >
                                <DataProvider
                                    getData={() => {
                                        return getDeviceTemprData();
                                    }}
                                    renderKey={
                                        temprsPage +
                                        temprsPageSize +
                                        latestChanged +
                                        temprFilterId +
                                        temprFilterName +
                                        temprFilterSelected
                                    }
                                    renderData={() => (
                                        <>
                                            <Table
                                                data={availableTemprs.data}
                                                rowClassName={row =>
                                                    `device-tempr${
                                                        row.selected
                                                            ? " selected"
                                                            : ""
                                                    }`
                                                }
                                                mapFunction={(
                                                    columnName,
                                                    content,
                                                    row,
                                                ) => {
                                                    if (
                                                        columnName === "action"
                                                    ) {
                                                        return (
                                                            <>
                                                                <Button
                                                                    kind={
                                                                        KIND.minimal
                                                                    }
                                                                    $as={Link}
                                                                    target="_blank"
                                                                    to={
                                                                        "/temprs/" +
                                                                        content
                                                                    }
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faExternalLinkAlt
                                                                        }
                                                                    />
                                                                </Button>
                                                            </>
                                                        );
                                                    }
                                                    if (
                                                        columnName ===
                                                        "selected"
                                                    ) {
                                                        if (
                                                            loading === row.id
                                                        ) {
                                                            return (
                                                                <IconSpinner />
                                                            );
                                                        }
                                                        return content ? (
                                                            <FontAwesomeIcon
                                                                icon={faCheck}
                                                            />
                                                        ) : (
                                                            <FontAwesomeIcon
                                                                icon={faTimes}
                                                            />
                                                        );
                                                    }

                                                    return content;
                                                }}
                                                columnContent={columnName => {
                                                    if (
                                                        columnName === "action"
                                                    ) {
                                                        return "id";
                                                    }

                                                    return columnName;
                                                }}
                                                columns={[
                                                    {
                                                        id: "selected",
                                                        name: "",
                                                        type: "bool",
                                                        hasFilter: true,
                                                        width: "20px",
                                                    },
                                                    {
                                                        id: "id",
                                                        name: "Id",
                                                        type: "text",
                                                        hasFilter: true,
                                                    },
                                                    {
                                                        id: "name",
                                                        name: "Name",
                                                        type: "text",
                                                        hasFilter: true,
                                                    },

                                                    {
                                                        id: "action",
                                                        name: "",
                                                        type: "action",
                                                        hasFilter: false,
                                                        width: "30px",
                                                    },
                                                ]}
                                                filters={{
                                                    id: temprFilterId,
                                                    name: temprFilterName,
                                                    selected: temprFilterSelected,
                                                }}
                                                updateFilters={(key, value) => {
                                                    switch (key) {
                                                        case "id":
                                                            return setTemprFilterId(
                                                                value,
                                                            );
                                                        case "name":
                                                            return setTemprFilterName(
                                                                value,
                                                            );
                                                        case "selected":
                                                            if (
                                                                value === null
                                                            ) {
                                                                return setTemprFilterSelected(
                                                                    "",
                                                                );
                                                            }
                                                            return setTemprFilterSelected(
                                                                value,
                                                            );
                                                        default:
                                                            return null;
                                                    }
                                                }}
                                                trueText="Selected"
                                                falseText="Not selected"
                                                onRowClick={(tempr, column) => {
                                                    if (
                                                        column !== "action" &&
                                                        !loading
                                                    ) {
                                                        return toggleDeviceTempr(
                                                            tempr,
                                                        );
                                                    }
                                                }}
                                            />
                                            <Pagination
                                                updatePageSize={pageSize => {
                                                    setTemprsPageSize(pageSize);
                                                }}
                                                currentPageSize={temprsPageSize}
                                                updatePageNumber={pageNumber =>
                                                    setTemprsPage(pageNumber)
                                                }
                                                totalRecords={
                                                    availableTemprs.totalRecords
                                                }
                                                numberOfPages={
                                                    availableTemprs.numberOfPages
                                                }
                                                currentPage={temprsPage || 1}
                                            />
                                        </>
                                    )}
                                />
                            </AccordionWithCaption>
                        )}
                    </>
                )}
            />
        </div>
    );
};

export { Device };
