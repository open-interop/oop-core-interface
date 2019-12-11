import React, { useState } from "react";
import { Card, StyledTitle } from "baseui/card";
import { DataCircle, DataProvider, InPlaceGifSpinner } from "../Universal";
import { Select } from "baseui/select";
import { Bar } from "react-chartjs-2";
import OopCore from "../../OopCore";
import moment from "moment";
import chartStyles from "./../../styles/_chartColours.scss";
import styles from "./../../styles/_variables.scss";

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

const Dashboard = props => {
    const dateFrom = props.dateFrom || {
        id: 1,
        name: "last 24 hours",
    };

    const [devices, setDevices] = useState({});
    const [transmissionTimeline, setTransmissionTimeline] = useState({});
    const [failedTransmissions, setFailedTransmissions] = useState({});
    const [generalStats, setGeneralStats] = useState({});

    const formatDateTime = dateTime => {
        return dateTime.toISOString().split("T")[0];
    };

    const now = new Date();
    const customStartDate = new Date(now.getTime());
    customStartDate.setDate(now.getDate() - dateFrom.id);

    const eightDaysAgo = new Date(now.getTime());
    eightDaysAgo.setDate(now.getDate() - 8);

    const oneYearAgo = new Date(now.getTime());
    oneYearAgo.setDate(now.getDate() - 365);

    const getAllDevices = () => {
        return OopCore.getDevices({
            pageSize: -1,
        }).then(response => {
            setDevices(response.data);
            return response;
        });
    };

    const getTransmissionsTimeline = () => {
        const devicesForSite = props.site
            ? devices.filter(device => device.siteId === props.site.id)
            : devices;

        return Promise.all(
            devicesForSite.map(device => getTransmissionsByDate(device)),
        ).then(timeline => setTransmissionTimeline(timeline));
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

    const getFailedTransmissions = () => {
        const oneDayAgo = new Date(now.getTime());
        oneDayAgo.setDate(now.getDate() - 1);

        const thirtyDaysAgo = new Date(now.getTime());
        thirtyDaysAgo.setDate(now.getDate() - 30);

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

    const getGeneralStats = () => {
        return Promise.all([
            OopCore.getDeviceGroups(),
            OopCore.getTemprs(),
        ]).then(([deviceGroupsResponse, temprsResponse]) => {
            setGeneralStats({
                deviceGroups: deviceGroupsResponse.totalRecords,
                devices: devices.length,
                temprs: temprsResponse.totalRecords,
            });
        });
    };

    const transmissionCardsFallback = (
        <div className="mb-20 space-between">
            <Card className="width-49">
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
                            value={dateFrom}
                        />
                    </div>
                </StyledTitle>
                <InPlaceGifSpinner />
            </Card>
            <Card className="width-49">
                <StyledTitle className="center">
                    Days since last transmission
                </StyledTitle>
                <InPlaceGifSpinner />
            </Card>
        </div>
    );

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

    const renderTransmissionCards = () => {
        const timelineRange = getDateRange(customStartDate, now);
        const lastTransmissionsRange = getDateRange(eightDaysAgo, now);

        const getDaysAgo = series => {
            var lastDay = 0;
            var i;
            for (i = lastTransmissionsRange.length - 1; i > 0; i--) {
                if (series.transmissions[lastTransmissionsRange[i].date]) {
                    break;
                } else {
                    lastDay = moment(now).diff(
                        moment(lastTransmissionsRange[i - 1].date),
                        "days",
                    );
                }
            }

            return {
                deviceId: series.deviceId,
                deviceName: series.deviceName,
                daysAgo: lastDay,
            };
        };

        const transmissionsByLastDay = transmissionTimeline
            .map(series => getDaysAgo(series))
            .filter(device => device.daysAgo < 7 && device.daysAgo !== 0);

        return (
            <div className="mb-20 space-between">
                <Card className="width-49">
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
                                value={dateFrom}
                            />
                        </div>
                    </StyledTitle>

                    <Bar
                        data={{
                            labels: timelineRange.map(date => date.label),
                            datasets: transmissionTimeline.map(
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
                                                index % availableColours.length
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
                </Card>
                <Card className="width-49">
                    <StyledTitle className="center">
                        Days since last transmission
                    </StyledTitle>
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
                                                index % availableColours.length
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
                                        },
                                    },
                                ],
                            },
                            legend: {
                                display: false,
                            },
                        }}
                    />
                </Card>
            </div>
        );
    };

    const renderCards = () => {
        return (
            <>
                <DataProvider
                    loadingFallback={transmissionCardsFallback}
                    getData={getTransmissionsTimeline}
                    renderKey={props.site ? props.site.id : ""}
                    renderData={renderTransmissionCards}
                />

                <div className="space-between">
                    <Card className="width-49 flex-column">
                        <StyledTitle className="center">
                            Failed Transmissions
                        </StyledTitle>
                        <DataProvider
                            loadingFallback={<InPlaceGifSpinner />}
                            getData={getFailedTransmissions}
                            renderKey={props.site ? props.site.id : ""}
                            renderData={() => {
                                return (
                                    <div className="flex-row">
                                        <DataCircle
                                            value={
                                                failedTransmissions.thirtyDays
                                            }
                                            color={styles.lightBlue}
                                            subtitle="in the last 30 days"
                                        />
                                        <DataCircle
                                            value={failedTransmissions.oneDay}
                                            color={styles.orange}
                                            subtitle="in the last 24 hours"
                                        />
                                    </div>
                                );
                            }}
                        />
                    </Card>

                    <Card className="width-49 flex-column">
                        <StyledTitle className="center">Stats</StyledTitle>
                        <DataProvider
                            loadingFallback={<InPlaceGifSpinner />}
                            getData={getGeneralStats}
                            renderData={() => {
                                return (
                                    <div className="flex-row">
                                        <DataCircle
                                            value={generalStats.deviceGroups}
                                            color={styles.teal}
                                            subtitle="Device Groups"
                                        />
                                        <DataCircle
                                            value={generalStats.devices}
                                            color={styles.lightBlue}
                                            subtitle="Devices"
                                        />
                                        <DataCircle
                                            value={generalStats.temprs}
                                            color={chartStyles.chart04}
                                            subtitle="Temprs"
                                        />
                                    </div>
                                );
                            }}
                        />
                    </Card>
                </div>
            </>
        );
    };

    return <DataProvider getData={getAllDevices} renderData={renderCards} />;
};

export { Dashboard };
