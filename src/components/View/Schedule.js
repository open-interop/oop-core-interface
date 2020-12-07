import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Button } from "baseui/button";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";

import { clearToast, ErrorToast, SuccessToast } from "../Global";
import {
    ConfirmModal,
    DataProvider,
    Page,
} from "../Universal";
import OopCore from "../../OopCore";
import { identicalObject } from "../../Utilities";

import TemprAssociator from "../Global/TemprAssociator";

const Schedule = props => {
    const [schedule, setSchedule] = useState({});
    const [updatedSchedule, setUpdatedSchedule] = useState({});
    const [relations, setRelations] = useState([]);
    const [scheduleErrors, setScheduleErrors] = useState({});

    const blankSchedule = props.match.params.scheduleId === "new";

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getSchedule = () => {
        return blankSchedule
            ? Promise.resolve({
                name: "",
                monthOfYear: "*",
                dayOfMonth: "*",
                dayOfWeek: "*",
                hour: "*",
                minute: "*",
                active: false,
                relations: [],
            })
            : OopCore.getSchedule(props.match.params.scheduleId);
    };

    const getScheduleTemprs = () => {
        return blankSchedule
            ? Promise.resolve([])
            : OopCore.getScheduleTemprs({
                filter: { scheduleId: props.match.params.scheduleId },
                "page[size]": -1,
            }).then(res => res.data);
    };

    const refreshSchedule = response => {
        setSchedule(response);
        setUpdatedSchedule({ ...response });

        return response;
    };

    const setValue = (key, value) => {
        const updatedData = { ...updatedSchedule };
        updatedData[key] = value;
        setUpdatedSchedule(updatedData);
    };

    const saveButtonDisabled = () => {
        return identicalObject(updatedSchedule, schedule);
    };

    const deleteSchedule = () => {
        return OopCore.deleteSchedule(updatedSchedule.id)
            .then(() => {
                props.history.replace(`/schedules`);
                SuccessToast("Deleted schedule", "Success");
            })
            .catch(error => {
                console.error(error);
                ErrorToast("Could not delete schedule", "Error");
            });
    };

    const saveSchedule = () => {
        clearToast();
        setScheduleErrors({});
        if (blankSchedule) {
            return OopCore.createSchedule(updatedSchedule)
                .then(response => {
                    SuccessToast("Created new schedule", "Success");
                    refreshSchedule(response);
                    props.history.replace(`/schedules/${response.id}`);
                })
                .catch(error => {
                    setScheduleErrors(error);
                    ErrorToast("Failed to create schedule", "Error");
                });
        } else {
            return OopCore.updateSchedule(updatedSchedule)
                .then(response => {
                    SuccessToast("Saved schedule details", "Success");
                    refreshSchedule(response);
                })
                .catch(error => {
                    setScheduleErrors(error);
                    ErrorToast("Failed to update schedule", "Error");
                });
        }
    };

    return (
        <Page
            title={
                blankSchedule
                    ? "New Schedule | Open Interop"
                    : "Edit Schedule | Open Interop"
            }
            heading={
                blankSchedule
                    ? "Create Schedule"
                    : "Edit Schedule"
            }
            backlink={props.location.prevPath || "/schedules"}
            actions={
                <>
                    {blankSchedule ? null : (
                        <Button
                            $as={Link}
                            to={{pathname: `/schedules/${props.match.params.scheduleId}/audit-logs`, state: {from: `/schedules/${props.match.params.scheduleId}/edit`}}}
                            aria-label={"History"}
                        >
                            History
                        </Button>
                    )}
                    {blankSchedule ? null : (
                        <ConfirmModal
                            buttonText="Delete"
                            title="Confirm Deletion"
                            mainText={
                                <>
                                    <div>
                                        Are you sure you want to
                                        delete this schedule?
                                    </div>
                                    <div>
                                        This action can't be undone.
                                    </div>
                                </>
                            }
                            primaryAction={deleteSchedule}
                            primaryActionText="Delete"
                            secondaryActionText="Cancel"
                        />
                    )}
                    <Button
                        onClick={saveSchedule}
                        disabled={saveButtonDisabled()}
                    >
                        {blankSchedule ? "Create" : "Save"}
                    </Button>
                </>
            }
        >
            <DataProvider
                getData={() => {
                    return Promise.all([
                        getSchedule().then(refreshSchedule),
                        getScheduleTemprs().then(setRelations),
                    ]);
                }}
                renderKey={props.location.pathname}
                renderData={() => (
                    <>
                        <FormControl
                            label="Name"
                            caption="required"
                            error={
                                scheduleErrors.name
                                    ? `Name ${scheduleErrors.name}`
                                    : ""
                            }
                        >
                            <Input
                                id="input-name"
                                value={updatedSchedule.name}
                                onChange={event =>
                                    setValue("name", event.currentTarget.value)
                                }
                                error={scheduleErrors.name}
                            />
                        </FormControl>
                        <FormControl label="Active">
                            <Checkbox
                                id="input-active"
                                checked={updatedSchedule.active}
                                onChange={() =>
                                    setValue("active", !updatedSchedule.active)
                                }
                                checkmarkType={STYLE_TYPE.toggle_round}
                            />
                        </FormControl>
                        <FormControl
                            label="Month of Year"
                            caption="required"
                            error={
                                scheduleErrors.monthOfYear
                                    ? `Day of Month ${scheduleErrors.monthOfYear}`
                                    : ""
                            }
                        >
                            <Input
                                id="input-moy"
                                value={updatedSchedule.monthOfYear}
                                onChange={event =>
                                    setValue(
                                        "monthOfYear",
                                        event.currentTarget.value,
                                    )
                                }
                                error={scheduleErrors.monthOfYear}
                            />
                        </FormControl>
                        <FormControl
                            label="Day of Month"
                            caption="required"
                            error={
                                scheduleErrors.dayOfMonth
                                    ? `Day of Month ${scheduleErrors.dayOfMonth}`
                                    : ""
                            }
                        >
                            <Input
                                id="input-dom"
                                value={updatedSchedule.dayOfMonth}
                                onChange={event =>
                                    setValue(
                                        "dayOfMonth",
                                        event.currentTarget.value,
                                    )
                                }
                                error={scheduleErrors.dayOfMonth}
                            />
                        </FormControl>
                        <FormControl
                            label="Day of Week"
                            caption="required"
                            error={
                                scheduleErrors.dayOfWeek
                                    ? `Day of Week ${scheduleErrors.dayOfWeek}`
                                    : ""
                            }
                        >
                            <Input
                                id="input-dow"
                                value={updatedSchedule.dayOfWeek}
                                onChange={event =>
                                    setValue(
                                        "dayOfWeek",
                                        event.currentTarget.value,
                                    )
                                }
                                error={scheduleErrors.dayOfWeek}
                            />
                        </FormControl>
                        <FormControl
                            label="Hour"
                            caption="required"
                            error={
                                scheduleErrors.hour
                                    ? `Day of Week ${scheduleErrors.hour}`
                                    : ""
                            }
                        >
                            <Input
                                id="input-hour"
                                value={updatedSchedule.hour}
                                onChange={event =>
                                    setValue("hour", event.currentTarget.value)
                                }
                                error={scheduleErrors.hour}
                            />
                        </FormControl>
                        <FormControl
                            label="Minute"
                            caption="required"
                            error={
                                scheduleErrors.minute
                                    ? `Day of Week ${scheduleErrors.minute}`
                                    : ""
                            }
                        >
                            <Input
                                id="input-minute"
                                value={updatedSchedule.minute}
                                onChange={event =>
                                    setValue(
                                        "minute",
                                        event.currentTarget.value,
                                    )
                                }
                                error={scheduleErrors.minute}
                            />
                        </FormControl>
                        {blankSchedule ||
                        <TemprAssociator
                            subtitle="Select temprs to associate with this schedule."
                            selected={relations}
                            onSelect={tempr => {
                                return OopCore.createScheduleTempr({
                                    scheduleId: schedule.id,
                                    temprId: tempr.id,
                                }).then(res => {
                                    setRelations([...relations, res]);
                                });
                            }}
                            onDeselect={(tempr, rel) => {
                                return OopCore.deleteScheduleTempr(rel.id, rel).then(
                                    res => {
                                        setRelations(
                                            relations.filter(
                                                v => v.id !== rel.id,
                                            ),
                                        );
                                    },
                                );
                            }}
                        />}
                    </>
                )}
            />
        </Page>
    );
};

export default Schedule;
