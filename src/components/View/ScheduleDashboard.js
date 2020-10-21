import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useStyletron } from "baseui";
import { Button, KIND } from "baseui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircle,
    faCheck,
    faEdit,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Table, Page, MaxCard, InPlaceGifSpinner, DatetimeTooltip } from "../Universal";
import { ListItem, ListItemLabel } from "baseui/list";
import { Map, TileLayer, Marker } from "react-leaflet";
import { Chart, Pie } from "react-chartjs-2";
import styles from "./../../styles/_variables.scss";
import OopCore from "../../OopCore";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";

const Waiting = props => {
    return (
        <MaxCard title={props.title}>
            <InPlaceGifSpinner />
        </MaxCard>
    );
};

const StatusIndicator = props => {
    const schedule = props.schedule;

    const [css, theme] = useStyletron();

    const active = css({
        float: "right",
        color: theme.colors.positive,
        fontSize: "smaller",
        ":after": { content: '" ACTIVE"' },
    });

    const inactive = css({
        float: "right",
        color: theme.colors.negative,
        fontSize: "smaller",
        ":after": { content: '" INACTIVE"' },
    });

    return (
        <span className={schedule.active ? active : inactive}>
            <FontAwesomeIcon
                className={schedule.active ? "blink" : ""}
                icon={faCircle}
            />
        </span>
    );
};

const ScheduleDetails = props => {
    const { schedule } = props;

    if (!(schedule && schedule.id)) {
        return <Waiting title="Details" />;
    }

    return (
        <MaxCard
            title={
                <>
                    Details <StatusIndicator schedule={schedule} />
                </>
            }
        >
            <ListItem>
                <div className="card-label">
                    <ListItemLabel description="Name">
                        {schedule.name}
                    </ListItemLabel>
                </div>
            </ListItem>
            <ListItem>
                <div className="card-label">
                    <ListItemLabel description="Created At">
                        <DatetimeTooltip time={schedule.createdAt}></DatetimeTooltip>
                    </ListItemLabel>
                </div>
            </ListItem>
            <ListItem>
                <div className="card-label">
                    <ListItemLabel description="Schedule Temprs">
                        {
                            schedule.scheduleTemprs
                                ? schedule.scheduleTemprs
                                : "No"
                        }{" "}
                        schedule temprs associated
                    </ListItemLabel>
                </div>
            </ListItem>
        </MaxCard>
    );
};

const ScheduleMessages = props => {
    const { schedule } = props;

    if (schedule === null) {
        return <Waiting title="Latest Messages" />;
    }

    if (!(schedule.messages && schedule.messages.length)) {
        return (
            <MaxCard title="Latest Messages">
                No messages available
            </MaxCard>
        );
    }
    return (
        <MaxCard
            title={
                <>
                    Latest Messages
                    <Button
                        kind={KIND.secondary}
                        $as={Link}
                        to={`/messages?filter=originType-Schedule_originId-${schedule.id}`}
                        $style={{ float: "right" }}
                    >
                        View All
                    </Button>
                </>
            }
        >
            <Table
                data={schedule.messages}
                mapFunction={(
                    columnName,
                    content,
                ) => {
                    if (columnName === "transmittedAt") {
                        return (
                            <DatetimeTooltip time={content}></DatetimeTooltip>
                        );
                    }
                    return content;
                }}
                columns={[
                    {
                        id:
                            "uuid",
                        name:
                            "Message UUID",
                    },
                    {
                        id: "transmissionCount",
                        name: "Transmission Count",
                    },
                    {
                        id: "createdAt",
                        name:
                            "Created at",
                    },
                ]}
            />
        </MaxCard>
    );
};

const ScheduleTimer = props => {
    const { schedule } = props;

    if (schedule === null) {
        return <Waiting title="Schedule Timer" />;
    }

    return (
        <MaxCard title="Schedule Timer">
            <ListItem>
                <div className="card-label">
                    <ListItemLabel description="Minute">
                        {schedule.minute}
                    </ListItemLabel>
                </div>
            </ListItem>
            <ListItem>
                <div className="card-label">
                    <ListItemLabel description="Hour">
                        {schedule.hour}
                    </ListItemLabel>
                </div>
            </ListItem>
            <ListItem>
                <div className="card-label">
                    <ListItemLabel description="Day Of Week">
                        {schedule.dayOfWeek}
                    </ListItemLabel>
                </div>
            </ListItem>
            <ListItem>
                <div className="card-label">
                    <ListItemLabel description="Day of Month">
                        {schedule.dayOfMonth}
                    </ListItemLabel>
                </div>
            </ListItem><ListItem>
                <div className="card-label">
                    <ListItemLabel description="Month of Year">
                        {schedule.monthOfYear}
                    </ListItemLabel>
                </div>
            </ListItem>         
        </MaxCard>
    );


};

const ScheduleTransmissionStatus = props => {
    const { schedule } = props;

    if (schedule === null) {
        return <Waiting title="Transmission Status" />;
    }

    if (!(schedule.transmissions && schedule.transmissions.length)) {
        return (
            <MaxCard title="Transmission Status">
                No transmission status available
            </MaxCard>
        );
    }

    const generateCustomLabels = chart => {
        var data = chart.data;

        if (data.labels.length && data.datasets.length) {
            return data.labels.map(function(label, i) {
                var meta = chart.getDatasetMeta(0);
                var ds = data.datasets[0];
                var arc = meta.data[i];
                var custom = (arc && arc.custom) || {};
                var getValueAtIndexOrDefault =
                    Chart.helpers.getValueAtIndexOrDefault;
                var arcOpts = chart.options.elements.arc;
                var fill = custom.backgroundColor
                    ? custom.backgroundColor
                    : getValueAtIndexOrDefault(
                          ds.backgroundColor,
                          i,
                          arcOpts.backgroundColor,
                      );
                var stroke = custom.borderColor
                    ? custom.borderColor
                    : getValueAtIndexOrDefault(
                          ds.borderColor,
                          i,
                          arcOpts.borderColor,
                      );
                var bw = custom.borderWidth
                    ? custom.borderWidth
                    : getValueAtIndexOrDefault(
                          ds.borderWidth,
                          i,
                          arcOpts.borderWidth,
                      );
                return {
                    text: ds.data[i] + " " + label.toLowerCase(),
                    fillStyle: fill,
                    strokeStyle: stroke,
                    lineWidth: bw,
                    hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                    index: i,
                };
            });
        }
        return [];
    };

    return (
        <MaxCard title="Transmission Status">
            <div className="flex-row center">
                <Pie
                    data={{
                        labels: schedule.stats.map(
                            stat => stat.label,
                        ),
                        datasets: [
                            {
                                data: schedule.stats.map(
                                    stat =>
                                        stat.value,
                                ),
                                backgroundColor: schedule.stats.map(
                                    stat =>
                                        stat.backgroundColor,
                                ),
                            },
                        ],
                    }}
                    options={{
                        legend: {
                            position: "right",
                            labels: {
                                generateLabels: generateCustomLabels,
                            },
                        },
                    }}
                />
            </div>
        </MaxCard>
    );
};

const ScheduleDashboard = props => {
    const scheduleId = props.match.params.scheduleId;
    const [schedule, setSchedule] = useState(null);
    const allSchedulesPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    useEffect(() => {
        Promise.all([
            OopCore.getSchedule(scheduleId),
            OopCore.getTransmissions(scheduleId, {
                "page[size]": 5,
            }),
            OopCore.getScheduleTemprs({
                filter: { scheduleId: scheduleId },
                "page[size]": -1,
            }),
            OopCore.getTransmissionStats({
                filter: {
                    scheduleId: scheduleId,
                },
                group: "state",
            }),
            OopCore.getMessages({
                filter: {
                    originType: "Schedule",
                    originId: scheduleId,
                },
                "page[size]": 5,
            })
        ])
            .then(([
                schedule,
                transmissions,
                scheduleTemprs,
                scheduleStats,
                messages,
            ]) => {
                schedule.transmissions = transmissions.data;
                schedule.scheduleTemprs = scheduleTemprs.data.length;
                schedule.messages = messages.data;


                const successfulTransmissions = {
                    label: "Successful",
                    value: scheduleStats.transmissions.successful || 0,
                    backgroundColor: styles.green,
                };
                const failedTransmissions = {
                    label: "Failed",
                    value: scheduleStats.transmissions.failed || 0,
                    backgroundColor: styles.red,
                };
                const skippedTransmissions = {
                    label: "Skipped",
                    value: scheduleStats.transmissions.skipped || 0,
                    backgroundColor: styles.orange,
                };

                schedule.stats = [successfulTransmissions, failedTransmissions, skippedTransmissions];

                setSchedule(schedule);
            });
    }, [scheduleId]);

    return (
        <Page
            title="Schedule Dashboard | Open Interop"
            heading="Schedule Dashboard"
            backlink={allSchedulesPath}
            actions={
                <Button
                    $as={Link}
                    kind={KIND.minimal}
                    to={`/schedules/${props.match.params.scheduleId}/edit`}
                    endEnhancer={() => <FontAwesomeIcon icon={faEdit} />}
                    aria-label="Edit this schedule"
                >
                    Edit
                </Button>
            }
        >
            <Grid behavior={BEHAVIOR.fluid} gridGaps={[32]} gridColumns={[5,5,12]} >
                <Cell span={5}>
                    <ScheduleDetails schedule={schedule} />
                </Cell>
                <Cell span={[5,5,7]}>
                    <ScheduleTransmissionStatus schedule={schedule} />
                </Cell>
                <Cell span={[5,5,7]}>
                    <ScheduleMessages schedule={schedule} />
                </Cell>
                <Cell span={5}>
                    <ScheduleTimer schedule={schedule} />
                </Cell>
            </Grid>
        </Page>
    );
};

export { ScheduleDashboard };
