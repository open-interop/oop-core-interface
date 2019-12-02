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
    const [dateFrom, setDateFrom] = useState({
        id: 1,
        name: "last 24 hours",
    });

    const [transmissionTimeline, setTransmissionTimeline] = useState({});
    const [failedTransmissions, setFailedTransmissions] = useState({});
    const [daysSinceLastTransmission, setDaysSinceLastTransmission] = useState(
        {},
    );
    const [generalStats, setGeneralStats] = useState({});

    const now = new Date();
    const startDate = new Date(now.getTime());
    startDate.setDate(now.getDate() - dateFrom.id);

    const getTransmissionsTimeline = () => {
        return OopCore.getDevices({
            siteId: props.site ? props.site.id : null,
        }).then(response => {
            const devices = response.data;
            return Promise.all(
                devices.map(device => getTransmissionsByDate(device)),
            );
        });
    };

    const getTransmissionsByDate = device => {
        return OopCore.getTransmissionStats({
            group: "transmitted_at",
            deviceId: device.id,
            gteq: startDate.toISOString().split("T")[0],
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
                gteq: thirtyDaysAgo.toISOString().split("T")[0],
                siteId: props.site ? props.site.id : undefined,
            }),
            OopCore.getTransmissionStats({
                group: "success",
                gteq: oneDayAgo.toISOString().split("T")[0],
                siteId: props.site ? props.site.id : undefined,
            }),
        ]).then(([thirtyDayResponse, oneDayResponse]) => {
            return {
                thirtyDays: thirtyDayResponse.transmissions.false || 0,
                oneDay: oneDayResponse.transmissions.false || 0,
            };
        });
    };

    const getDaysSinceLastTransmissions = () => {
        return OopCore.getTransmissionStats({
            group: "device_id",
            field: "transmittedAt",
            direction: "asc",
        });
    };

    const getGeneralStats = () => {
        return Promise.all([
            OopCore.getDeviceGroups(),
            OopCore.getDevices(),
            OopCore.getTemprs(),
        ]).then(([deviceGroupsResponse, devicesResponse, temprsResponse]) => {
            return {
                deviceGroups: deviceGroupsResponse.totalRecords,
                devices: devicesResponse.totalRecords,
                temprs: temprsResponse.totalRecords,
            };
        });
    };

    return (
        <>
            <div className="mb-20 space-between">
                <Card className="width-49">
                    <StyledTitle className="center">
                        Transmissions
                        <div className="width-19">
                            <Select
                                required
                                options={[
                                    { id: 1, name: "last 24 hours" },
                                    { id: 30, name: "last 30 days" },
                                    { id: 180, name: "last 180 days" },
                                    { id: 365, name: "last 365 days" },
                                ]}
                                labelKey="name"
                                valueKey="id"
                                searchable={false}
                                onChange={event => {
                                    setDateFrom(event.option);
                                }}
                                value={dateFrom}
                            />
                        </div>
                    </StyledTitle>
                    <DataProvider
                        loadingFallback={<InPlaceGifSpinner />}
                        getData={() =>
                            getTransmissionsTimeline().then(response =>
                                setTransmissionTimeline(response),
                            )
                        }
                        renderKey={
                            props.site
                                ? props.site.id + dateFrom.id
                                : dateFrom.id
                        }
                        renderData={() => {
                            const dates = [];

                            var currDate = moment(startDate).startOf("day");
                            var lastDate = moment(now).startOf("day");

                            while (currDate.add(1, "days").diff(lastDate) < 0) {
                                dates.push(currDate.clone().toDate());
                            }

                            const dateRange = dates.map(date => {
                                return {
                                    date: moment(date).format("YYYY-MM-DD"),
                                    label: moment(date).format("DD MMM"),
                                };
                            });

                            return (
                                <Bar
                                    data={{
                                        labels: dateRange.map(
                                            date => date.label,
                                        ),
                                        datasets: transmissionTimeline.map(
                                            (series, index) => {
                                                return {
                                                    label: series.deviceName,
                                                    data: dateRange.map(
                                                        date =>
                                                            series
                                                                .transmissions[
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
                                    }}
                                />
                            );
                        }}
                    />
                </Card>
                <Card className="width-49">
                    <StyledTitle className="center">
                        Days since last transmission
                    </StyledTitle>
                    <DataProvider
                        loadingFallback={<InPlaceGifSpinner />}
                        getData={() =>
                            getDaysSinceLastTransmissions().then(response =>
                                setDaysSinceLastTransmission(response),
                            )
                        }
                        renderKey={props.site ? props.site.id : ""}
                        renderData={() => {
                            return <div>days since last transmission</div>;
                        }}
                    />
                </Card>
            </div>

            <div className="space-between">
                <Card className="width-49 flex-column">
                    <StyledTitle className="center">
                        Failed Transmissions
                    </StyledTitle>
                    <DataProvider
                        loadingFallback={<InPlaceGifSpinner />}
                        getData={() =>
                            getFailedTransmissions().then(response =>
                                setFailedTransmissions(response),
                            )
                        }
                        renderKey={props.site ? props.site.id : ""}
                        renderData={() => {
                            return (
                                <div className="flex-row">
                                    <DataCircle
                                        value={failedTransmissions.thirtyDays}
                                        color={styles.orange}
                                        subtitle="in the last 30 days"
                                    />
                                    <DataCircle
                                        value={failedTransmissions.oneDay}
                                        color={styles.lightBlue}
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
                        getData={() =>
                            getGeneralStats().then(response =>
                                setGeneralStats(response),
                            )
                        }
                        renderData={() => {
                            return (
                                <div className="flex-row">
                                    <DataCircle
                                        value={generalStats.deviceGroups}
                                        color={styles.lightBlue}
                                        subtitle="Device Groups"
                                    />
                                    <DataCircle
                                        value={generalStats.devices}
                                        color={styles.orange}
                                        subtitle="Devices"
                                    />
                                    <DataCircle
                                        value={generalStats.temprs}
                                        color={styles.teal}
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

export { Dashboard };
