import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQueryParam, NumberParam } from "use-query-params";
import { Button, KIND } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
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

const Schedule = props => {
    const [schedule, setSchedule] = useState({});
    const [updatedSchedule, setUpdatedSchedule] = useState({});
    const [scheduleErrors, setScheduleErrors] = useState({});

    const blankSchedule = props.match.params.scheduleId === "new";
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = blankSchedule
            ? "New Schedule | Open Interop"
            : "Edit Schedule | Open Interop";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getSchedule = () => {
        return blankSchedule
            ? Promise.resolve({
                  active: false,
                  authenticationHeaders: [],
                  authenticationPath: "",
                  authenticationQuery: [],
                  latitude: "",
                  longitude: "",
                  name: "",
                  siteId: "",
                  timeZone: "",
              })
            : OopCore.getSchedule(props.match.params.scheduleId);
    };

    const copyOfArray = original => {
        const copy = [];
        original.forEach((item, index) => {
            copy[index] = [...item];
        });

        return copy;
    };

    const refreshSchedule = response => {
        console.log(response);
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
        return !(
            updatedSchedule.name &&
            updatedSchedule.monthOfYear &&
            updatedSchedule.dayOfMonth &&
            updatedSchedule.dayOfWeek &&
            updatedSchedule.hour &&
            updatedSchedule.minute
        );
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
                    props.history.replace(
                        `/schedules/${response.id}`,
                    );
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
        <div className="content-wrapper">
            <DataProvider
                getData={() => {
                    return getSchedule().then(refreshSchedule);
                }}
                renderKey={props.location.pathname}
                renderData={() => (
                    <>
                        <div className="space-between">
                            <Button
                                $as={Link}
                                kind={KIND.minimal}
                                to={props.location.prevPath}
                                aria-label={
                                    props.location.prevPath
                                        ? "Go back to schedules"
                                        : "Go back to schedule dashboard"
                                }
                            >
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </Button>
                            <h2>
                                {blankSchedule ? "Create Schedule" : "Edit Schedule"}
                            </h2>
                            <div>
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
                            </div>
                        </div>

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
                                    setValue("monthOfYear", event.currentTarget.value)
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
                                    setValue("dayOfMonth", event.currentTarget.value)
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
                                    setValue("dayOfWeek", event.currentTarget.value)
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
                                value={updatedSchedule.dayOfWeek}
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
                                    setValue("minute", event.currentTarget.value)
                                }
                                error={scheduleErrors.minute}
                            />
                        </FormControl>
                    </>
                )}
            />
        </div>
    );
};

export { Schedule };
