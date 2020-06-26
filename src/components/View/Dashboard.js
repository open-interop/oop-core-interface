import React, { useState, useEffect } from "react";
import moment from "moment";

import { useStyletron } from "baseui";
import { Card, StyledTitle, StyledBody } from "baseui/card";
import { Select } from "baseui/select";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";

import { Bar } from "react-chartjs-2";

import OopCore from "../../OopCore";

import chartStyles from "./../../styles/_chartColours.scss";
import styles from "./../../styles/_variables.scss";

import { DataCircle, DataProvider, InPlaceGifSpinner } from "../Universal";

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

const getDaysAgo = (now, lastTransmissionsRange, series) => {
    let dayDifference = 0;
    for (let i = lastTransmissionsRange.length - 1; i > 0; i--) {
        if (series.transmissions[lastTransmissionsRange[i].date]) {
            break;
        } else {
            dayDifference = moment(now).diff(
                moment(lastTransmissionsRange[i - 1].date),
                "days",
            );
        }
    }

    return {
        deviceId: series.deviceId,
        deviceName: series.deviceName,
        daysAgo: dayDifference,
    };
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
                gteq: formatDateTime(thirtyDaysAgo),
                siteId: props.site ? props.site.id : undefined,
            }),
            OopCore.getTransmissionStats({
                group: "success",
                gteq: formatDateTime(oneDayAgo),
                siteId: props.site ? props.site.id : undefined,
            }),
        ]).then(([thirtyDayResponse, oneDayResponse]) => {
            setFailedTransmissions({
                thirtyDays: thirtyDayResponse.transmissions.false || 0,
                oneDay: oneDayResponse.transmissions.false || 0,
            });
        });
    };

    const [css] = useStyletron();

    return (
        <Card className={css({ width: "100%", height: "100%" })} >
            <StyledTitle className="center">
                Failed Transmissions
            </StyledTitle>
            <StyledBody>
                <DataProvider
                    loadingFallback={<InPlaceGifSpinner />}
                    getData={getFailedTransmissions}
                    renderKey={props.site ? props.site.id : ""}
                    renderData={() => {
                        return (
                            <Grid>
                                <Cell span={[12, 12, 4]} skip={[0, 0, 1]}>
                                    <DataCircle
                                        value={
                                            failedTransmissions.thirtyDays
                                        }
                                        color={styles.lightBlue}
                                        subtitle="in the last 30 days"
                                    />
                                </Cell>
                                <Cell span={[12, 12, 4]} skip={[0, 0, 2]}>
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
            </StyledBody>
        </Card>
    );
};

const Transmissions = props => {
    const timelineRange = getDateRange(props.customStartDate, props.now);

    const [css] = useStyletron();

    return (
        <Card className={css({ width: "100%", height: "100%" })} >
            <StyledTitle className="center">
                Transmissions
                <div className="width-19">
                    <Select
                        required
                        options={[
                            {
                                id: 1,
                                name: "last 24 hours",
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
                </div>
            </StyledTitle>
            <StyledBody>
            {props.transmissionTimeline === null ?
                <InPlaceGifSpinner /> :
                <div className="center">
                    {!props.transmissionTimeline.length && (
                        <div className="chart-overlay">
                            No transmission data available
                        </div>
                    )}
                    <Bar
                        data={{
                            labels: timelineRange.map(date => date.label),
                            datasets: props.transmissionTimeline.map(
                                (series, index) => {
                                    return {
                                        label: series.deviceName,
                                        data: timelineRange.map(
                                            date =>
                                                series.transmissions[
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
                                yAxes: [{ stacked: true }],
                                xAxes: [{ stacked: true }],
                            },
                            tooltips: {
                                mode: "label",
                            },
                        }}
                    />
                </div>
            }
            </StyledBody>
        </Card>
    );
};

const DaysSinceLastTransmission = props => {
    const transmissionsByLastDay = props.transmissionsByLastDay;

    const [css] = useStyletron();

    return (
        <Card className={css({ width: "100%", height: "100%" })} >
            <StyledTitle className="center">
                Days since last transmission
            </StyledTitle>
            <StyledBody>
            {transmissionsByLastDay === null ?
                <InPlaceGifSpinner /> :
                <div className="center">
                    {!transmissionsByLastDay.length && (
                        <div className="chart-overlay">
                            No transmission data available
                        </div>
                    )}
                    <Bar
                        data={{
                            labels: transmissionsByLastDay.map(
                                device => device.deviceName,
                            ),
                            datasets: [
                                {
                                    data: transmissionsByLastDay.map(
                                        device => device.daysAgo,
                                    ),
                                    backgroundColor: transmissionsByLastDay.map(
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
                </div>
            }
            </StyledBody>
        </Card>
    );
};

const Stats = props => {
    const devices = props.devices;

    const [generalStats, setGeneralStats] = useState(null);

    useEffect(() => {
        if (devices === null) {
            return;
        }

        Promise.all([
            OopCore.getDeviceGroups(),
            OopCore.getTemprs(),
        ]).then(([deviceGroupsResponse, temprsResponse]) => {
            setGeneralStats({
                deviceGroups: deviceGroupsResponse.totalRecords,
                devices: props.devices.length,
                temprs: temprsResponse.totalRecords,
            });
        });
    }, [devices]);

    const [css] = useStyletron();

    return (
        <Card className={css({ width: "100%", height: "100%" })} >
            <StyledTitle className="center">Stats</StyledTitle>
            <StyledBody>
                {generalStats === null ?
                    <InPlaceGifSpinner /> :
                    <Grid>
                        <Cell span={[12, 12, 4]}>
                            <DataCircle
                                value={generalStats.deviceGroups}
                                color={styles.teal}
                                subtitle="Device Groups"
                            />
                        </Cell>
                        <Cell span={[12, 12, 4]}>
                            <DataCircle
                                value={generalStats.devices}
                                color={styles.lightBlue}
                                subtitle="Devices"
                            />
                        </Cell>
                        <Cell span={[12, 12, 4]}>
                            <DataCircle
                                value={generalStats.temprs}
                                color={chartStyles.chart04}
                                subtitle="Temprs"
                            />
                        </Cell>
                    </Grid>
                }
            </StyledBody>
        </Card>
    );
};

const Dashboard = props => {
    const [devices, setDevices] = useState(null);
    const [transmissionTimeline, setTransmissionTimeline] = useState(null);

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

    const lastTransmissionsRange = getDateRange(eightDaysAgo, now);

    const transmissionsByLastDay = transmissionTimeline ?
        transmissionTimeline
            .map(series => getDaysAgo(now, lastTransmissionsRange, series))
            .filter(device => device.daysAgo !== 0) :
            null;

    const getAllDevices = () => {
        return OopCore.getDevices({
            pageSize: -1,
        }).then(response => {
            setDevices(response.data);
        });
    };

    const getTransmissionsByDate = device => {
        return OopCore.getTransmissionStats({
            group: "transmitted_at",
            deviceId: device.id,
            gteq: formatDateTime(oneYearAgo),
        }).then(response => {
            response.deviceId = device.id;
            response.deviceName = device.name;
            return response;
        });
    };

    const getTransmissionsTimeline = (site, devices) => {
        setTransmissionTimeline(null);
        const devicesForSite = site
            ? devices.filter(device => device.siteId === site.id)
            : devices;

        return Promise.all(
            devicesForSite.map(device => getTransmissionsByDate(device)),
        ).then(timeline => setTransmissionTimeline(timeline));
    };

    useEffect(() => {
        getAllDevices();
    }, []);

    useEffect(() => {
        if (devices === null) {
            return;
        }

        getTransmissionsTimeline(props.site, devices);
    }, [devices, props.site]);

    return (
        <Grid
            behavior={BEHAVIOR.fluid}
            gridGaps={[32]}
        >
            <Cell span={6}>
                <Transmissions
                    dateFrom={dateFrom}
                    setDateFrom={props.setDateFrom}
                    now={now}
                    transmissionTimeline={transmissionTimeline}
                    customStartDate={customStartDate}
                />
            </Cell>
            <Cell span={6}>
                <DaysSinceLastTransmission
                    transmissionsByLastDay={transmissionsByLastDay}
                />
            </Cell>
            <Cell span={6}>
                <FailedTransmissions now={now} />
            </Cell>
            <Cell span={6}>
                <Stats devices={devices} />
            </Cell>
        </Grid>
    );
};

export { Dashboard };
