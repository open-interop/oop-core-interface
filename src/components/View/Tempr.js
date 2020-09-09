import React, { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";

import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Textarea } from "baseui/textarea";

import {
    AccordionWithCaption,
    ConfirmModal,
    Page,
    InPlaceGifSpinner,
} from "../Universal";

import {
    clearToast,
    ErrorToast,
    HttpTemprTemplate,
    SuccessToast,
    TemprForm,
    TemprPreview,
    TemprOutputTest,
    TemprModal,
} from "../Global";

import DeviceAssociator from "../Global/DeviceAssociator";
import ScheduleAssociator from "../Global/ScheduleAssociator";

import { compareByValue } from "../../Utilities";

import OopCore from "../../OopCore";
import "brace/mode/json";
import "brace/mode/javascript";
import "brace/mode/handlebars";
import "brace/theme/kuroir";


const getTempr = (temprId, deviceGroupId) => {
    if (temprId === "new") {
        return  Promise.resolve({
            name: "",
            temprId: null,
            description: "",
            deviceGroupId: Number(deviceGroupId) || null,
            endpointType: "http",
            queueResponse: false,
            queueRequest: false,
            notes: "",
            template: {},
        });
    } else {
        return OopCore.getTempr(temprId);
    }
};

const getData = (temprId, deviceGroupId, getParents, getChildren) => {
    return Promise.all([
        getTempr(temprId, deviceGroupId),
        OopCore.getDeviceGroups(),
        OopCore.getDeviceTemprs({
            filter: { temprId: temprId },
            "page[size]": -1,
        }),
        OopCore.getScheduleTemprs({
            temprId: temprId,
            "page[size]": -1,
        }),
        getParents(temprId),
        getChildren(temprId),
    ]);
};

const DeviceTemprAssociator = memo(({
    temprId,
    deviceGroupId,
    deviceTemprs,
    setDeviceTemprs,
    temprErrors,
    setTemprErrors
}) => {
    const setError = error => {
        const newErrors = {
            ...temprErrors,
            deviceTemprs: error.errors,
        };
        setTemprErrors(newErrors);
    };

    return (
        <DeviceAssociator
            deviceGroupId={deviceGroupId}
            selected={deviceTemprs}
            onSelect={device => {
                return OopCore.createDeviceTempr({
                    deviceId: device.id,
                    temprId: temprId
                })
                    .then(res => {
                        setDeviceTemprs([...deviceTemprs, res]);
                    })
                    .catch(setError);
            }}
            onDeselect={(device, dt) => {
                return OopCore.deleteDeviceTempr(dt.id, {
                    deviceId: device.id,
                    temprId: temprId
                })
                    .then(() => {
                        setDeviceTemprs(
                            deviceTemprs.filter(v => v.id !== dt.id)
                        );
                    })
                    .catch(setError);
            }}
            error={temprErrors.deviceTemprs}
        />
    );
});

const ScheduleTemprAssociator = memo(({
    temprId,
    scheduleTemprs,
    setScheduleTemprs,
    temprErrors,
    setTemprErrors
}) => {
    return (
        <ScheduleAssociator
            selected={scheduleTemprs}
            onSelect={schedule => {
                return OopCore.createScheduleTempr({
                    scheduleId: schedule.id,
                    temprId
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
                    temprId
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
    );
});

const Tempr = props => {
    const temprId = props.match.params.temprId;

    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const [originalTempr, setOriginalTempr] = useState(null);

    const [noChildren, setNoChildren] = useState(true);
    const [noParents, setNoParents] = useState(true);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [deviceGroupId, setDeviceGroupId] = useState(Number(props.match.params.deviceGroupId) || null);
    const [parentTemprId, setParentTemprId] = useState(null);
    const [endpointType, setEndpointType] = useState("http");
    const [queueResponse, setQueueResponse] = useState(false);
    const [queueRequest, setQueueRequest] = useState(false);
    const [notes, setNotes] = useState("");
    const [template, setTemplate] = useState({});
    const [exampleTransmission, setExampleTransmission] = useState("");

    const [temprErrors, setTemprErrors] = useState({});

    const [groups, setGroups] = useState([]);
    const [deviceTemprs, setDeviceTemprs] = useState([]);
    const [scheduleTemprs, setScheduleTemprs] = useState([]);

    useEffect(
        () => { getData(temprId, props.match.params.deviceGroupId, getParents, getChildren).then(setData); },
        [temprId, props.match.params.deviceGroupId]
    ); 

    const blankTempr = temprId === "new";


    async function getChildren(temprId) {
        const ts = await OopCore.getTemprs({temprId: temprId});
        var none = true;
        if (ts) {
            for (const tempr of ts.data) {
                if (tempr.temprId == temprId) {
                    none = false;
                    break;
                }
            }
        }
        setNoChildren(none);
    };

    async function getParents(temprId) {
        const t = await OopCore.getTempr(temprId);
        setNoChildren(!t.temprId);
    };

    const setData = ([tempr, groups, deviceTemprs, scheduleTemprs]) => {
        setOriginalTempr({
            name: tempr.name,
            description: tempr.description,
            deviceGroupId: tempr.deviceGroupId,
            temprId: parentTemprId,
            endpointType: tempr.endpointType,
            queueResponse: tempr.queueResponse,
            queueRequest: tempr.queueRequest,
            notes: tempr.notes,
            template: tempr.template,
            exampleTransmission: tempr.exampleTransmission,
        });

        setTemprFromObject(tempr);
        setGroups(groups.data);
        setDeviceTemprs(deviceTemprs.data);
        setScheduleTemprs(scheduleTemprs.data);
        setLoading(false);
    };

    const setTemprFromObject = tempr => {
        setName(tempr.name);
        setDescription(tempr.description);
        setDeviceGroupId(tempr.deviceGroupId);
        setParentTemprId(tempr.temprId);
        setEndpointType(tempr.endpointType);
        setQueueResponse(tempr.queueResponse);
        setQueueRequest(tempr.queueRequest);
        setNotes(tempr.notes);
        setTemplate(tempr.template);
        setExampleTransmission(tempr.exampleTransmission);
    };

    const temprToObject = () => {
        return {
            name,
            description,
            deviceGroupId,
            temprId: parentTemprId,
            endpointType,
            queueResponse,
            queueRequest,
            notes,
            template,
            exampleTransmission,
        };
    };

    const allTemprsPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    const deleteTempr = () => {
        return OopCore.deleteTempr(temprId)
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

        const tempr = temprToObject();

        if (blankTempr) {
            return OopCore.createTempr(tempr)
                .then(response => {
                    SuccessToast("Created new tempr", "Success");
                    setTemprFromObject(response);
                    props.history.replace(`/temprs/${response.id}`);
                })
                .catch(error => {
                    setTemprErrors(error);
                    ErrorToast("Failed to create tempr", "Error");
                });
        } else {
            OopCore.updateTempr(temprId, tempr)
                .then(response => {
                    setTemprFromObject(response);
                    SuccessToast("Updated tempr", "Success");
                })
                .catch(error => {
                    setTemprErrors(error);
                    ErrorToast("Failed to update tempr", "Error");
                });
        }
    };

    const setValue = setter => {
        return event => {
            setter(event.currentTarget.value);
        };
    };

    const getTemprTemplateAndPreview = () => {
        if (modalOpen) {
            return (
                <TemprModal
                    exampleTransmission={exampleTransmission}
                    setExampleTransmission={setExampleTransmission}
                    template={template}
                    setTemplate={setTemplate}
                    errors={temprErrors}
                    onClose={() => setModalOpen(false)}
                />
            );
        } else {
            return (
                <>
                    <AccordionWithCaption
                        title="Template"
                        caption="required"
                        error={temprErrors.base}
                        startOpen
                    >
                        <div className="content-wrapper">
                            <HttpTemprTemplate
                                template={template}
                                updateTemplate={setTemplate}
                                error={temprErrors.base}
                            />
                        </div>
                    </AccordionWithCaption>
                    <AccordionWithCaption title="Test">
                        <TemprPreview
                            value={exampleTransmission}
                            setValue={setExampleTransmission}
                        />
                        <TemprOutputTest
                            transmission={exampleTransmission}
                            template={template}
                            showOpenButton={true}
                            openEditor={() => setModalOpen(true)}
                        />
                    </AccordionWithCaption>
                </>
            );
        }
    };

    return (
        <Page
            title={
                blankTempr
                    ? "New Tempr | Settings | Open Interop"
                    : "Edit Tempr | Settings | Open Interop"
            }
            heading={blankTempr ? "Create Tempr" : "Edit Tempr"}
            backlink={allTemprsPath}
            actions={
                <>
                    {blankTempr || (noParents && noChildren) ? null : (
                        <Button
                            $as={Link}
                            to={`${props.location.pathname}/map`}
                            aria-label={"Tempr Map"}
                        >
                            View Map
                        </Button>
                    )}
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
                        aria-label={
                            blankTempr
                                ? "Create tempr"
                                : "Update tempr"
                        }
                    >
                        {blankTempr ? "Create" : "Save"}
                    </Button>
                </>
            }
            alert={
                !compareByValue(originalTempr, temprToObject()) &&
                "There are unsaved changes, are you sure you want to leave?"
            }
        >
            {loading ?
                <InPlaceGifSpinner /> :
                <>
                    {
                    }
                    <div>
                        <TemprForm
                            name={[name, setName]}
                            description={[description, setDescription]}
                            deviceGroupId={[deviceGroupId, setDeviceGroupId]}
                            parentTemprId={[parentTemprId, setParentTemprId]}
                            endpointType={[endpointType, setEndpointType]}
                            queueResponse={[queueResponse, setQueueResponse]}
                            queueRequest={[queueRequest, setQueueRequest]}
                            groups={groups}
                            temprId={temprId}
                            errors={temprErrors}
                        />
                        {getTemprTemplateAndPreview()}
                        <FormControl
                            label="Notes"
                            key={`form-control-notes`}
                        >
                            <Textarea
                                value={notes}
                                onChange={setValue(setNotes)}
                            />
                        </FormControl>
                        {blankTempr ? null : (
                            <>
                                <DeviceTemprAssociator
                                    temprId={temprId}
                                    deviceTemprs={deviceTemprs}
                                    setDeviceTemprs={setDeviceTemprs}
                                    temprErrors={temprErrors}
                                    setTemprErrors={setTemprErrors}
                                    deviceGroupId={deviceGroupId}
                                />
                                <ScheduleTemprAssociator
                                    temprId={temprId}
                                    scheduleTemprs={scheduleTemprs}
                                    setScheduleTemprs={setScheduleTemprs}
                                    temprErrors={temprErrors}
                                    setTemprErrors={setTemprErrors}
                                    deviceGroupId={deviceGroupId}
                                />
                            </>
                        )}
                        <Button
                            onClick={saveTempr}
                            aria-label={
                                blankTempr ? "Create tempr" : "Update tempr"
                            }
                        >
                            {blankTempr ? "Create" : "Save"}
                        </Button>
                        {props.error && <div>{props.error}</div>}
                    </div>
                </>
            }
        </Page>
    );
};

export { Tempr };
