import React, { useState, useEffect } from "react";
import moment from "moment";

import { useStyletron } from "baseui";
import { Select } from "baseui/select";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";

import { Bar } from "react-chartjs-2";

import OopCore from "../../OopCore";

import chartStyles from "./../../styles/_chartColours.scss";
import styles from "./../../styles/_variables.scss";

import { DataCircle, DataProvider, InPlaceGifSpinner, MaxCard } from "../Universal";

const availableColours = [
    chartStyles.chart01,
    chartStyles.chart02,
    chartStyles.chart03,
    chartStyles.chart04,
    chartStyles.chart05,
    chartStyles.chart06,
    chartStyles.chart07,
    chartStyles.chart08,
    chartStyles.chart09,
    chartStyles.chart10,
    chartStyles.chart11,
    chartStyles.chart12,
    chartStyles.chart13,
    chartStyles.chart14,
    chartStyles.chart15,
    chartStyles.chart16,
    chartStyles.chart17,
    chartStyles.chart18,
    chartStyles.chart19,
    chartStyles.chart20,
    chartStyles.chart21,
    chartStyles.chart22,
];

const formatDateTime = dateTime => {
    return dateTime.toISOString().split("T")[0];
};

const getDateRange = (startDate, endDate) => {
    const timelineDates = [];

    var currentDate = moment(startDate).startOf("day");
    var lastPossibleDate = moment(endDate).endOf("day");

    while (currentDate.add(1, "days").diff(lastPossibleDate) < 0) {
        timelineDates.push(currentDate.clone().toDate());
    }

    return timelineDates.map(date => {
        return {
            date: moment(date).format("YYYY-MM-DD"),
            label: moment(date).format("DD MMM"),
        };
    });
};

const getDaysAgo = (now, lastMessagesRange, series) => {
    let dayDifference = 0

    for (let i = lastMessagesRange.length - 1; i > 0; i--) {
        if (series.messages[lastMessagesRange[i].date]) {
            break;
        } else {
            dayDifference = moment(now).diff(
                moment(lastMessagesRange[i - 1].date),
                "days",
            );
        }
    }

    return {
        originId: series.originId,
        originName: series.originName,
        daysAgo: dayDifference,
    };
};

const CenteredTitle = props => {
    const [css, theme] = useStyletron();

    return <div className={css({ textAlign: "center", marginBottom: theme.sizing.scale500 })} >
        {props.children}
    </div>
};

const FailedTransmissions = props => {
    const [failedTransmissions, setFailedTransmissions] = useState({});

    const getFailedTransmissions = () => {
        const oneDayAgo = new Date(props.now.getTime());
        oneDayAgo.setDate(props.now.getDate() - 1);

        const thirtyDaysAgo = new Date(props.now.getTime());
        thirtyDaysAgo.setDate(props.now.getDate() - 30);

        return Promise.all([
            OopCore.getTransmissionStats({
                group: "success",
                filter: {
                    transmittedAt: { gteq: formatDateTime(thirtyDaysAgo) },
                    siteId: props.site ? props.site.id : undefined,
                },
            }),
            OopCore.getTransmissionStats({
                group: "success",
                filter: {
                    transmittedAt: { gteq: formatDateTime(oneDayAgo) },
                    siteId: props.site ? props.site.id : undefined,
                },
            }),
        ]).then(([thirtyDayResponse, oneDayResponse]) => {
            setFailedTransmissions({
                thirtyDays: thirtyDayResponse.transmissions.false || 0,
                oneDay: oneDayResponse.transmissions.false || 0,
            });
        });
    };

    return (
        <MaxCard title={
            <CenteredTitle>
                Failed Transmissions
            </CenteredTitle>
        } >
            <div>
                <DataProvider
                    loadingFallback={<InPlaceGifSpinner />}
                    getData={getFailedTransmissions}
                    renderKey={props.site ? props.site.id : ""}
                    renderData={() => {
                        return (
                            <Grid gridColumns={12}>
                                <Cell span={[12, 6, 6]} >
                                    <DataCircle
                                        value={
                                            failedTransmissions.thirtyDays
                                        }
                                        color={styles.lightBlue}
                                        subtitle="in the last 30 days"
                                    />
                                </Cell>
                                <Cell span={[12, 6, 6]} >
                                <DataCircle
                                    value={failedTransmissions.oneDay}
                                    color={styles.orange}
                                    subtitle="in the last 24 hours"
                                />
                                </Cell>
                            </Grid>
                        );
                    }}
                />
            </div>
        </MaxCard>
    );
};

const Messages = props => {
    const timelineRange = getDateRange(props.customStartDate, props.now);

    return (
        <MaxCard title={
            <CenteredTitle>
                Messages
            </CenteredTitle>
        } >
            {props.messageTimeline === null ?
                <InPlaceGifSpinner /> :
                <>
                    <div className="center">
                        {!props.messageTimeline.length && (
                            <div style={{textAlign: 'center', position: 'relative'}}>
                                No message data available
                            </div>
                        )}
                        <Select
                            required
                            options={[
                                {
                                    id: 1,
                                    name: "last 24 hours",
                                },
                                {
                                    id: 7,
                                    name: "last 7 days",
                                },
                                {
                                    id: 30,
                                    name: "last 30 days",
                                },
                                {
                                    id: 180,
                                    name: "last 180 days",
                                },
                                {
                                    id: 365,
                                    name: "last 365 days",
                                },
                            ]}
                            labelKey="name"
                            valueKey="id"
                            searchable={false}
                            onChange={event => {
                                props.setDateFrom(event.option);
                            }}
                            value={[props.dateFrom]}
                        />
                        <Bar
                            data={{
                                labels: timelineRange.map(date => date.label),
                                datasets: props.messageTimeline.map(
                                    (series, index) => {
                                        return {
                                            label: series.originName,
                                            data: timelineRange.map(
                                                date =>
                                                    series.messages[
                                                        date.date
                                                    ] || 0,
                                            ),
                                            backgroundColor:
                                                availableColours[
                                                    index %
                                                        availableColours.length
                                                ],
                                        };
                                    },
                                ),
                            }}
                            options={{
                                scales: {
                                    yAxes: [
                                        {
                                            stacked: true,
                                            ticks: {
                                                beginAtZero: true
                                            }
                                        }
                                    ],
                                    xAxes: [{ stacked: true }],
                                },
                                tooltips: {
                                    mode: "label",
                                },
                            }}
                        />
                    </div>
                </>
            }
        </MaxCard>
    );
};

const DaysSinceLastMessage = props => {
    const messagesByLastDay = props.messagesByLastDay;

    const [css] = useStyletron();

    const center = css({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    });

    return (
        <MaxCard
            title={
                <CenteredTitle>
                    Days since last message
                </CenteredTitle>
            }
        >
            <div className={center}>
            {messagesByLastDay === null
                ? <InPlaceGifSpinner />
                : <>
                    {!messagesByLastDay.length && (
                        <div className="chart-overlay">
                            No message data available
                        </div>
                    )}
                    <Bar
                        data={{
                            labels: messagesByLastDay.map(
                                origin => origin.originName,
                            ),
                            datasets: [
                                {
                                    data: messagesByLastDay.map(
                                        origin => origin.daysAgo,
                                    ),
                                    backgroundColor: messagesByLastDay.map(
                                        (currentValue, index) =>
                                            availableColours[
                                                index %
                                                    availableColours.length
                                            ],
                                    ),
                                },
                            ],
                        }}
                        options={{
                            scales: {
                                yAxes: [
                                    {
                                        ticks: {
                                            beginAtZero: true,
                                            stepSize: 1,
                                            callback: value =>
                                                value < 7 ? value : "7+",
                                        },
                                    },
                                ],
                            },
                            legend: {
                                display: false,
                            },
                            tooltips: {
                                enabled: false,
                            },
                        }}
                    />
                </>
            }
            </div>
        </MaxCard>
    );
};

const Stats = props => {
    const devices = props.devices;
    const schedules = props.schedules;

    const [generalStats, setGeneralStats] = useState(null);

    useEffect(() => {
        if (devices === null || schedules === null) {
            return;
        }

        Promise.all([
            OopCore.getDeviceGroups(),
            OopCore.getTemprs(),
        ]).then(([deviceGroupsResponse, temprsResponse]) => {
            setGeneralStats({
                deviceGroups: deviceGroupsResponse.totalRecords,
                devices: devices.length,
                temprs: temprsResponse.totalRecords,
                schedules: schedules.length
            });
        });
    }, [devices, schedules]);

    return (
        <MaxCard title={
            <CenteredTitle>Stats</CenteredTitle>
        } >
            <div>
                {generalStats === null ?
                    <InPlaceGifSpinner /> :
                    <Grid gridColumns={12}>
                        <Cell span={[12, 6, 6, 3]}>
                            <DataCircle
                                value={generalStats.deviceGroups}
                                color={styles.teal}
                                subtitle="Device Groups"
                            />
                        </Cell>
                        <Cell span={[12, 6, 6, 3]}>
                            <DataCircle
                                value={generalStats.devices}
                                color={styles.lightBlue}
                                subtitle="Devices"
                            />
                        </Cell>
                        <Cell span={[12, 6, 6, 3]}>
                            <DataCircle
                                value={generalStats.temprs}
                                color={chartStyles.chart04}
                                subtitle="Temprs"
                            />
                        </Cell>
                        <Cell span={[12, 6, 6, 3]}>
                            <DataCircle
                                value={generalStats.schedules}
                                color={chartStyles.chart02}
                                subtitle="Schedules"
                            />
                        </Cell>
                    </Grid>
                }
            </div>
        </MaxCard>
    );
};

const Dashboard = props => {
    const [origins, setOrigins] = useState(null);
    const [devices, setDevices] = useState(null);
    const [schedules, setSchedules] = useState(null);
    const [messageTimeline, setMessageTimeline] = useState(null);

    useEffect(() => {
        document.title = "Dashboard | Open Interop";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const dateFrom = props.dateFrom || {
        id: 1,
        name: "last 24 hours",
    };

    const now = new Date();
    const customStartDate = new Date(now.getTime());
    customStartDate.setDate(now.getDate() - dateFrom.id);

    const eightDaysAgo = new Date(now.getTime());
    eightDaysAgo.setDate(now.getDate() - 8);

    const oneYearAgo = new Date(now.getTime());
    oneYearAgo.setDate(now.getDate() - 365);

    const lastMessagesRange = getDateRange(eightDaysAgo, now);

    const messagesByLastDay = messageTimeline ?
        messageTimeline
            .map(series => getDaysAgo(now, lastMessagesRange, series)) :
            null;

    const getAllOrigins = () => {
        return Promise.all([
            OopCore.getDevices({"page[size]": -1}),
            OopCore.getSchedules({"page[size]": -1,}),
        ]).then(([devices, schedules]) => {
                setSchedules(schedules.data);
                setDevices(devices.data);
                var scheduleOrigins = schedules.data.map((s) => {
                    var oData = {};
                    oData.id = s.id;
                    oData.name = s.name;
                    oData.siteId = null;
                    oData.type = "Schedule";
                    return oData;
                });
                var deviceOrigins = devices.data.map((d) => {
                    var oData = {};
                    oData.id = d.id;
                    oData.name = d.name;
                    oData.siteId = d.siteId;
                    oData.type = "Device";
                    return oData;
                });
                setOrigins(scheduleOrigins.concat(deviceOrigins));
            });
    };

    const getMessagesByDate = origin => {
        return OopCore.getMessageStats({
            group: "created_at",
            filter: {
                originId: origin.id,
                createdAt: { gteq: formatDateTime(oneYearAgo) },
            },
        }).then(response => {
            response.originId = origin.id;
            response.originName = origin.name + ' (' + origin.type[0] + ')' ;
            return response;
        });
    };

    const getMessageTimeline = (site, origins) => {
        setMessageTimeline(null);
        const originsForSite = site
            ? origins.filter(origin => origin.siteId === site.id)
            : origins;

        return Promise.all(
            originsForSite.map(origin => getMessagesByDate(origin)),
        ).then(timeline => setMessageTimeline(timeline));
    };

    useEffect(() => {
        getAllOrigins();
    }, []);

    useEffect(() => {
        if (origins === null) {
            return;
        }

        getMessageTimeline(props.site, origins);
    }, [origins, props.site]);

    return (
        <Grid
            behavior={BEHAVIOR.fluid}
            gridGaps={[32]}
            gridColumns={[6,6,12]}
        >
            <Cell span={6}>
                <Messages
                    dateFrom={dateFrom}
                    setDateFrom={props.setDateFrom}
                    now={now}
                    messageTimeline={messageTimeline}
                    customStartDate={customStartDate}
                />
            </Cell>
            <Cell span={6}>
                <DaysSinceLastMessage
                    messagesByLastDay={messagesByLastDay}
                />
            </Cell>
            <Cell span={6}>
                <FailedTransmissions now={now} />
            </Cell>
            <Cell span={6}>
                <Stats devices={devices} schedules={schedules}/>
            </Cell>
        </Grid>
    );
};

export default Dashboard;
