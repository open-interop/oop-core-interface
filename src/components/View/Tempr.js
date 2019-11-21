import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AceEditor from "react-ace";
import { Button, KIND } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Select } from "baseui/select";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import { Textarea } from "baseui/textarea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faExternalLinkAlt,
    faCheck,
    faTimes,
    faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
    AccordionWithCaption,
    BaseuiSpinner,
    DataProvider,
    IconSpinner,
    Pagination,
    Table,
} from "../Universal";
import {
    clearToast,
    ErrorToast,
    HttpTemprTemplate,
    SuccessToast,
} from "../Global";
import { arrayToObject, identicalObject } from "../../Utilities";
import { StatefulTabs, Tab } from "baseui/tabs";
import OopCore from "../../OopCore";
import "brace/mode/json";
import "brace/theme/github";
var JSONPretty = require("react-json-pretty");

const endpointTypeOptions = [{ id: "http" }, { id: "ftp" }];

const Tempr = props => {
    const [tempr, setTempr] = useState({});
    const [updatedTempr, setUpdatedTempr] = useState({});
    const [temprErrors, setTemprErrors] = useState({});
    const [groups, setGroups] = useState([]);
    const [availableDevices, setAvailableDevices] = useState([]);
    const [devicesPage, setDevicesPage] = useState(1);
    const [devicesPageSize, setDevicesPageSize] = useState(10);
    const [latestChanged, setLatestChanged] = useState(false);

    const [deviceFilterId, setDeviceFilterId] = useState("");
    const [deviceFilterName, setDeviceFilterName] = useState("");
    const [deviceFilterSite, setDeviceFilterSite] = useState("");
    const [deviceFilterSelected, setDeviceFilterSelected] = useState("");

    const [deviceTemprLoading, setDeviceTemprLoading] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);

    const blankTempr = props.match.params.temprId === "new";

    useEffect(() => {
        setDevicesPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        devicesPageSize,
        deviceFilterId,
        deviceFilterName,
        deviceFilterSite,
        deviceFilterSelected,
    ]);

    const getTempr = () => {
        return blankTempr
            ? Promise.resolve({
                  name: "",
                  description: "",
                  deviceGroupId: Number(props.match.params.deviceGroupId),
                  endpointType: "http",
                  queueResponse: false,
                  queueRequest: false,
                  notes: "",
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

    const toggleDeviceTempr = device => {
        setDeviceTemprLoading(device.id);
        temprErrors.deviceTemprs = "";
        if (device.selected) {
            setLatestChanged(device.id, false);
            return OopCore.deleteDeviceTempr(device.selected.id, {
                deviceId: device.id,
                temprId: updatedTempr.id,
            })
                .then(() => {
                    setDeviceTemprLoading(false);
                    getDeviceTemprData();
                })
                .catch(error => {
                    setDeviceTemprLoading(false);
                    temprErrors.deviceTemprs = error.errors;
                });
        } else {
            setLatestChanged(device.id, true);
            return OopCore.createDeviceTempr({
                deviceId: device.id,
                temprId: updatedTempr.id,
            })
                .then(() => {
                    setDeviceTemprLoading(false);
                    getDeviceTemprData();
                })
                .catch(error => {
                    setDeviceTemprLoading(false);
                    temprErrors.deviceTemprs = error.errors;
                });
        }
    };

    const getDeviceTemprData = () => {
        return Promise.all([
            OopCore.getDevices({
                deviceGroupId: updatedTempr.deviceGroupId,
                pageSize: devicesPageSize,
                page: devicesPage,
                id: deviceFilterId,
                name: deviceFilterName,
                siteId: deviceFilterSite,
            }),
            OopCore.getDeviceTemprs({
                temprId: props.match.params.temprId,
                pageSize: -1,
            }),
            OopCore.getSites({ pageSize: -1 }),
        ]).then(([availableDevices, deviceTemprs, sites]) => {
            const deviceTemprsObject = arrayToObject(
                deviceTemprs.data,
                "deviceId",
            );

            const sitesObject = arrayToObject(sites.data, "id");

            availableDevices.data.forEach(device => {
                device.selected = deviceTemprsObject[device.id];
                device.siteName = sitesObject[device.siteId]
                    ? sitesObject[device.siteId].fullName
                    : "";
            });

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
        });
    };

    const calculateOutput = () => {
        setPreviewLoading(true);
        setPreviewVisible(true);
        return OopCore.previewTempr({
            tempr: {
                exampleTransmission: updatedTempr.exampleTransmission,
                template: updatedTempr.template,
            },
        })
            .then(response => {
                setPreviewLoading(false);
                setValue("previewTempr", JSON.stringify(response));
            })
            .catch(error => {
                setPreviewLoading(false);
                console.error(error);
                ErrorToast(
                    "Could not preview example transmission with current mapping",
                    "Error",
                );
            });
    };

    const prettifiedPreview = () => {
        if (updatedTempr.previewTempr) {
            const previewObject = JSON.parse(updatedTempr.previewTempr);

            const initialState = {
                activeKey: previewObject.error ? "2" : "0",
            };

            return (
                <StatefulTabs initialState={initialState}>
                    <Tab title="Rendered body">
                        <JSONPretty
                            className="tempr-preview-content "
                            data={
                                previewObject.rendered
                                    ? previewObject.rendered.body
                                    : ""
                            }
                        ></JSONPretty>
                    </Tab>
                    <Tab title="Console output">
                        <JSONPretty
                            className="tempr-preview-content "
                            data={previewObject.console}
                        ></JSONPretty>
                    </Tab>
                    <Tab title="Error output">
                        <JSONPretty
                            className="tempr-preview-content "
                            data={previewObject.error}
                        ></JSONPretty>
                    </Tab>
                </StatefulTabs>
            );
        }
    };

    const getPreviewBox = () => {
        if (previewVisible && previewLoading) {
            return (
                <div className="tempr-preview center">
                    <BaseuiSpinner />
                </div>
            );
        }
        if (previewVisible && !previewLoading) {
            return <div className="tempr-preview">{prettifiedPreview()}</div>;
        }
        return null;
    };
    return (
        <div className="content-wrapper">
            <Button
                $as={Link}
                kind={KIND.minimal}
                to={allTemprsPath}
                aria-label="Go back to all temprs"
            >
                <FontAwesomeIcon icon={faChevronLeft} />
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
                        <FormControl
                            label="Endpoint type"
                            key={"form-control-group-endpoint-type"}
                            caption="required"
                        >
                            <Select
                                options={endpointTypeOptions}
                                labelKey="id"
                                valueKey="id"
                                searchable={false}
                                clearable={false}
                                onChange={event => {
                                    setValue("endpointType", event.option.id);
                                }}
                                value={endpointTypeOptions.find(
                                    item =>
                                        item.id === updatedTempr.endpointType ||
                                        item.id === "http",
                                )}
                                error={props.error}
                                disabled
                            />
                        </FormControl>
                        <FormControl
                            label="Queue Response"
                            key={`form-control-queue-response`}
                        >
                            <Checkbox
                                checked={updatedTempr.queueResponse}
                                onChange={() =>
                                    setValue(
                                        "queueResponse",
                                        !updatedTempr.queueResponse,
                                    )
                                }
                                checkmarkType={STYLE_TYPE.toggle_round}
                            />
                        </FormControl>
                        <FormControl
                            label="Queue Request"
                            key={`form-control-queue-request`}
                        >
                            <Checkbox
                                checked={updatedTempr.queueRequest}
                                onChange={() =>
                                    setValue(
                                        "queueRequest",
                                        !updatedTempr.queueRequest,
                                    )
                                }
                                checkmarkType={STYLE_TYPE.toggle_round}
                            />
                        </FormControl>

                        <AccordionWithCaption
                            title="Template"
                            caption="required"
                            error={temprErrors.base}
                            subtitle="Please provide a host, port, path, protocol and request method"
                            // startOpen
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
                        <AccordionWithCaption title="Body" startOpen>
                            <div className="one-row mb-20">
                                <div className="w-50">
                                    <label>Example</label>
                                    <AceEditor
                                        mode="json"
                                        theme="github"
                                        width="100%"
                                        showPrintMargin={false}
                                        onChange={value => {
                                            setValue(
                                                "exampleTransmission",
                                                value,
                                            );
                                        }}
                                        editorProps={{
                                            $blockScrolling: true,
                                        }}
                                        value={
                                            updatedTempr.exampleTransmission ||
                                            ""
                                        }
                                    />
                                </div>
                                <div className="w-50">
                                    <label>Mapping</label>
                                    <AceEditor
                                        mode="javascript"
                                        theme="github"
                                        width="100%"
                                        showPrintMargin={false}
                                        onChange={value => {
                                            const updatedData = {
                                                ...updatedTempr,
                                            };
                                            updatedData.template.body = {
                                                language: "js",
                                                script: value,
                                            };
                                            setUpdatedTempr(updatedData);
                                        }}
                                        editorProps={{
                                            $blockScrolling: true,
                                        }}
                                        value={
                                            updatedTempr.template.body
                                                ? updatedTempr.template.body
                                                      .script
                                                : ""
                                        }
                                    />
                                </div>
                            </div>
                            <Button
                                kind={KIND.secondary}
                                onClick={calculateOutput}
                                isLoading={previewLoading}
                            >
                                Calculate output
                            </Button>
                            {getPreviewBox()}
                        </AccordionWithCaption>
                        <FormControl label="Notes" key={`form-control-notes`}>
                            <Textarea
                                value={updatedTempr.notes || ""}
                                onChange={e => setValue(e.target.value)}
                            />
                        </FormControl>
                        <AccordionWithCaption
                            title="Device associations "
                            subtitle="Select devices to associate with this tempr"
                            error={temprErrors.deviceTemprs}
                            startOpen
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
                                    deviceFilterSite +
                                    deviceFilterSelected
                                }
                                renderData={() => (
                                    <>
                                        <Table
                                            data={availableDevices.data}
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
                                                if (columnName === "action") {
                                                    return (
                                                        <>
                                                            <Button
                                                                kind={
                                                                    KIND.minimal
                                                                }
                                                                $as={Link}
                                                                target="_blank"
                                                                to={
                                                                    "/devices/" +
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

                                                if (columnName === "selected") {
                                                    if (
                                                        deviceTemprLoading ===
                                                        row.id
                                                    ) {
                                                        return <IconSpinner />;
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
                                                if (columnName === "action") {
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
                                                    id: "siteId",
                                                    name: "Site ID",
                                                    type: "text",
                                                    hasFilter: true,
                                                },
                                                {
                                                    id: "siteName",
                                                    name: "Site",
                                                    type: "text",
                                                    hasFilter: false,
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
                                                id: deviceFilterId,
                                                name: deviceFilterName,
                                                siteId: deviceFilterSite,
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
                                                    case "siteId":
                                                        return setDeviceFilterSite(
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
                                            trueText="Selected"
                                            falseText="Not selected"
                                            onRowClick={device => {
                                                if (!deviceTemprLoading) {
                                                    return toggleDeviceTempr(
                                                        device,
                                                    );
                                                }
                                            }}
                                        />
                                        <Pagination
                                            updatePageSize={pageSize => {
                                                setDevicesPageSize(pageSize);
                                            }}
                                            currentPageSize={devicesPageSize}
                                            updatePageNumber={pageNumber =>
                                                setDevicesPage(pageNumber)
                                            }
                                            totalRecords={
                                                availableDevices.totalRecords
                                            }
                                            numberOfPages={
                                                availableDevices.numberOfPages
                                            }
                                            currentPage={devicesPage || 1}
                                        />
                                    </>
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
                            aria-label={
                                blankTempr ? "Create tempr" : "Update tempr"
                            }
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
