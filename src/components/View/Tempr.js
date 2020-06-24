import React, { useState, useEffect } from "react";
import { Link, Prompt } from "react-router-dom";
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
    faExpandArrowsAlt,
    faCompressArrowsAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
    AccordionWithCaption,
    BaseuiSpinner,
    ConfirmModal,
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
    TemprSelector,
} from "../Global";

import DeviceAssociator from "../Global/DeviceAssociator";
import ScheduleAssociator from "../Global/ScheduleAssociator";

import { arrayToObject, identicalObject } from "../../Utilities";
import { Tabs, Tab } from "baseui/tabs";
import OopCore from "../../OopCore";
import "brace/mode/json";
import "brace/mode/javascript";
import "brace/mode/handlebars";
import "brace/theme/kuroir";
var JSONPretty = require("react-json-pretty");

const endpointTypeOptions = [{ id: "http" }, { id: "ftp" }];

const Tempr = props => {
    const [tempr, setTempr] = useState({});
    const [updatedTempr, setUpdatedTempr] = useState({});
    const [temprErrors, setTemprErrors] = useState({});
    const [groups, setGroups] = useState([]);

    const [deviceTemprs, setDeviceTemprs] = useState([]);
    const [scheduleTemprs, setScheduleTemprs] = useState([]);

    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);

    const [activeTab, setActiveTab] = useState("0");
    const [mappingFullScreen, setMappingFullScreen] = useState(false);
    const [fullScreenActiveTab, setFullScreenActiveTab] = useState("0");

    const blankTempr = props.match.params.temprId === "new";

    useEffect(() => {
        document.title = blankTempr
            ? "New Tempr | Settings | Open Interop"
            : "Edit Tempr | Settings | Open Interop";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getTempr = () => {
        return blankTempr
            ? Promise.resolve({
                name: "",
                temprId: null,
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
        return Promise.all([
            getTempr(),
            OopCore.getDeviceGroups(),
            OopCore.getDeviceTemprs({
                temprId: props.match.params.temprId,
                pageSize: -1,
            }),
            OopCore.getScheduleTemprs({
                temprId: props.match.params.temprId,
                pageSize: -1,
            }),
        ]).then(
            ([tempr, groups, deviceTemprs, scheduleTemprs]) => {
                refreshTempr(tempr);
                setGroups(groups.data);
                setDeviceTemprs(deviceTemprs.data);
                setScheduleTemprs(scheduleTemprs.data);
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
        temprErrors.deviceTemprs = "";
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
                setValue("previewTempr", response);
                setActiveTab(response.error ? "2" : "0");
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

    const PreviewTemprBox = () => {
        if (previewVisible && previewLoading) {
            return (
                <div className="tempr-preview center">
                    <BaseuiSpinner />
                </div>
            );
        }
        if (previewVisible && !previewLoading && updatedTempr.previewTempr) {
            return (
                <div className="tempr-preview">
                    <Tabs
                        onChange={({ activeKey }) => {
                            setActiveTab(activeKey);
                        }}
                        activeKey={activeTab}
                    >
                        <Tab title="Rendered body">
                            <JSONPretty
                                className="tempr-preview-content "
                                data={
                                    updatedTempr.previewTempr.rendered
                                        ? updatedTempr.previewTempr.rendered
                                              .body
                                        : "No data to show"
                                }
                            />
                        </Tab>
                        <Tab title="Console output">
                            <JSONPretty
                                className="tempr-preview-content "
                                data={
                                    updatedTempr.previewTempr.console ||
                                    "No data to show"
                                }
                            />
                        </Tab>
                        <Tab title="Error output">
                            <JSONPretty
                                className="tempr-preview-content "
                                data={
                                    updatedTempr.previewTempr.error ||
                                    "No data to show"
                                }
                            />
                        </Tab>
                    </Tabs>
                </div>
            );
        }
        return null;
    };

    const deleteTempr = () => {
        return OopCore.deleteTempr(updatedTempr.id)
            .then(() => {
                props.history.replace(`/temprs`);
                SuccessToast("Deleted tempr", "Success");
            })
            .catch(error => {
                console.error(error);
                ErrorToast("Could not delete tempr", "Error");
            });
    };


    const saveTempr = () => {
        clearToast();
        setTemprErrors({});
        if (blankTempr) {
            return OopCore.createTempr(updatedTempr)
                .then(response => {
                    SuccessToast("Created new tempr", "Success");
                    refreshTempr(response);
                    props.history.replace(`/temprs/${response.id}`);
                })
                .catch(error => {
                    setTemprErrors(error);
                    ErrorToast("Failed to create tempr", "Error");
                });
        } else {
            OopCore.updateTempr(props.match.params.temprId, updatedTempr)
                .then(response => {
                    refreshTempr(response);
                    SuccessToast("Updated tempr", "Success");
                })
                .catch(error => {
                    setTemprErrors(error);
                    ErrorToast("Failed to update tempr", "Error");
                });
        }
    };

    const ExampleEditor = () => {
        return (
            <AceEditor
                mode="json"
                theme="kuroir"
                width="100%"
                height={mappingFullScreen ? "75vh" : "500px"}
                showPrintMargin={false}
                onChange={value => {
                    setValue("exampleTransmission", value);
                }}
                editorProps={{
                    $blockScrolling: true,
                }}
                value={updatedTempr.exampleTransmission || ""}
            />
        );
    };

    const MappingEditor = () => {
        return (
            <>
                <div className="flex-row mb-10">
                    <label>Basic mapping</label>
                    <div className="toggle">
                        <Checkbox
                            isIndeterminate={true}
                            checked={
                                updatedTempr.template.body &&
                                updatedTempr.template.body.language === "js"
                            }
                            onChange={event => {
                                const updatedData = {
                                    ...updatedTempr,
                                };
                                updatedData.template.body = {
                                    language: event.target.checked
                                        ? "js"
                                        : "handlebars",
                                    script: updatedData.template.body.script,
                                };
                                setUpdatedTempr(updatedData);
                            }}
                            checkmarkType={STYLE_TYPE.toggle_round}
                        />
                    </div>
                    <label>Advanced mapping</label>
                </div>
                <AceEditor
                    mode={
                        updatedTempr.template.body &&
                        updatedTempr.template.body.language === "js"
                            ? "javascript"
                            : "handlebars"
                    }
                    theme="kuroir"
                    width="100%"
                    height={mappingFullScreen ? "75vh" : "500px"}
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
                            ? updatedTempr.template.body.script
                            : ""
                    }
                />
            </>
        );
    };

    const renderBody = () => {
        if (mappingFullScreen) {
            return (
                <div className="overlay">
                    <div className="space-between">
                        <h3>Tempr body</h3>
                        <Button
                            kind={KIND.secondary}
                            onClick={() => {
                                document.body.classList.remove("no-scroll");
                                setMappingFullScreen(false);
                            }}
                        >
                            <FontAwesomeIcon icon={faCompressArrowsAlt} />
                        </Button>
                    </div>
                    <Tabs
                        onChange={({ activeKey }) => {
                            setFullScreenActiveTab(activeKey);
                        }}
                        activeKey={fullScreenActiveTab}
                    >
                        <Tab title="Example">{ExampleEditor()}</Tab>
                        <Tab title="Mapping">{MappingEditor()}</Tab>
                        <Tab title="Output">
                            <Button
                                kind={KIND.primary}
                                onClick={calculateOutput}
                                isLoading={previewLoading}
                            >
                                Calculate output
                            </Button>
                            {PreviewTemprBox()}
                        </Tab>
                    </Tabs>
                </div>
            );
        } else {
            return (
                <>
                    <div className="flex-row-reverse">
                        <Button
                            kind={KIND.secondary}
                            onClick={() => {
                                document.body.classList.add("no-scroll");
                                setMappingFullScreen(true);
                            }}
                        >
                            <FontAwesomeIcon icon={faExpandArrowsAlt} />
                        </Button>
                    </div>
                    <div className="flex-row mb-20">
                        <div className="w-50">
                            <div className="mb-10">Example</div>
                            {ExampleEditor()}
                        </div>
                        <div className="w-50">{MappingEditor()}</div>
                    </div>
                    <Button
                        kind={KIND.secondary}
                        onClick={calculateOutput}
                        isLoading={previewLoading}
                    >
                        Calculate output
                    </Button>
                    {PreviewTemprBox()}
                </>
            );
        }
    };

    return (
        <>
            <Prompt message="Are you sure you want to leave this page?" />
            <div
                className={`content-wrapper ${
                    mappingFullScreen ? "no-scroll" : ""
                }`}
            >
                <DataProvider
                    getData={() => {
                        return getData();
                    }}
                    renderData={() => (
                        <>
                            <div className="space-between">
                                <Button
                                    $as={Link}
                                    kind={KIND.minimal}
                                    to={allTemprsPath}
                                    aria-label="Go back to all temprs"
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </Button>
                                <h2>
                                    {blankTempr ? "Create Tempr" : "Edit Tempr"}
                                </h2>
                                <div>
                                    {blankTempr ? null : (
                                        <ConfirmModal
                                            buttonText="Delete"
                                            title="Confirm Deletion"
                                            mainText={
                                                <>
                                                    <div>
                                                        Are you sure you want to
                                                        delete this tempr?
                                                    </div>
                                                    <div>
                                                        This action can't be
                                                        undone.
                                                    </div>
                                                </>
                                            }
                                            primaryAction={deleteTempr}
                                            primaryActionText="Delete"
                                            secondaryActionText="Cancel"
                                        />
                                    )}
                                    <Button
                                        onClick={saveTempr}
                                        disabled={saveButtonDisabled()}
                                        aria-label={
                                            blankTempr
                                                ? "Create tempr"
                                                : "Update tempr"
                                        }
                                    >
                                        {blankTempr ? "Create" : "Save"}
                                    </Button>
                                </div>
                            </div>
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
                                        setValue(
                                            "name",
                                            event.currentTarget.value,
                                        )
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
                                            item.id ===
                                            updatedTempr.deviceGroupId,
                                    )}
                                    error={temprErrors.deviceGroup}
                                />
                            </FormControl>
                            <FormControl
                                label="Parent Tempr"
                                key={"form-control-group-parent"}
                            >
                                <TemprSelector
                                    deviceGroup={updatedTempr.deviceGroupId}
                                    onChange={event => {
                                        setValue(
                                            "temprId",
                                            event.value[0]
                                                ? event.value[0].id
                                                : null,
                                        );
                                    }}
                                    value={updatedTempr.temprId}
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
                                        setValue(
                                            "endpointType",
                                            event.option.id,
                                        );
                                    }}
                                    value={endpointTypeOptions.find(
                                        item =>
                                            item.id ===
                                                updatedTempr.endpointType ||
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
                                {renderBody()}
                            </AccordionWithCaption>
                            <FormControl
                                label="Notes"
                                key={`form-control-notes`}
                            >
                                <Textarea
                                    value={updatedTempr.notes || ""}
                                    onChange={e => setValue(e.target.value)}
                                />
                            </FormControl>
                            {blankTempr ? null : (
                                <>
                                    <DeviceAssociator
                                        selected={deviceTemprs}
                                        onSelect={device => {
                                            return OopCore.createDeviceTempr({
                                                deviceId: device.id,
                                                temprId: updatedTempr.id,
                                            })
                                                .then(res => {
                                                    setDeviceTemprs([...deviceTemprs, res]);
                                                })
                                                .catch(error => {
                                                    temprErrors.deviceTemprs = error.errors;
                                                });
                                        }}
                                        onDeselect={(device, dt) => {
                                            return OopCore.deleteDeviceTempr(dt.id, {
                                                deviceId: device.id,
                                                temprId: updatedTempr.id,
                                            })
                                                .then(() => {
                                                    setDeviceTemprs(deviceTemprs.filter(v => v.id !== dt.id));
                                                })
                                                .catch(error => {
                                                    temprErrors.deviceTemprs = error.errors;
                                                });
                                        }}
                                        error={temprErrors.deviceTemprs}
                                    />
                                    <ScheduleAssociator
                                        selected={scheduleTemprs}
                                        onSelect={schedule => {
                                            return OopCore.createScheduleTempr({
                                                scheduleId: schedule.id,
                                                temprId: updatedTempr.id,
                                            })
                                                .then(res => {
                                                    setScheduleTemprs([...scheduleTemprs, res]);
                                                })
                                                .catch(error => {
                                                    temprErrors.scheduleTemprs = error.errors;
                                                });
                                        }}
                                        onDeselect={(schedule, st) => {
                                            console.log(schedule, st);
                                            return OopCore.deleteScheduleTempr(st.id, {
                                                scheduleId: schedule.id,
                                                temprId: updatedTempr.id,
                                            })
                                                .then(() => {
                                                    setScheduleTemprs(scheduleTemprs.filter(v => v.id !== st.id));
                                                })
                                                .catch(error => {
                                                    temprErrors.scheduleTemprs = error.errors;
                                                });
                                        }}
                                        error={temprErrors.scheduleTemprs}
                                    />
                                </>
                            )}
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
        </>
    );
};

export { Tempr };
