import React, { useState } from "react";
import { Card, StyledTitle } from "baseui/card";
import { DataCircle, DataProvider } from "../Universal";
import {
    DiscreteColorLegend,
    XYPlot,
    VerticalGridLines,
    HorizontalGridLines,
    XAxis,
    YAxis,
    VerticalBarSeries,
} from "react-vis";
import OopCore from "../../OopCore";
import moment from "moment";
import styles from "./../../styles/_variables.scss";

const Dashboard = props => {
    const [transmissionTimeline, setTransmissionTimeline] = useState({});
    const [failedTransmissions, setFailedTransmissions] = useState({});
    const [daysSinceLastTransmission, setDaysSinceLastTransmission] = useState(
        {},
    );
    const [generalStats, setGeneralStats] = useState({});

    const now = new Date();
    const oneDayAgo = new Date(now.getTime());
    oneDayAgo.setDate(now.getDate() - 1);
    const thirtyDaysAgo = new Date(now.getTime());
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const oneHundredEightyDaysAgo = new Date(now.getTime());
    oneHundredEightyDaysAgo.setDate(now.getDate() - 180);

    const getTransmissionsTimeline = () => {
        return OopCore.getDevices().then(response => {
            const devices = response.data.filter(
                device => !props.site || props.site.id === device.siteId,
            );

            return Promise.all(
                devices.map(device => getTransmissionsByDate(device)),
            );
        });
    };
    const getTransmissionsByDate = device => {
        return OopCore.getTransmissionStats({
            group: "transmitted_at",
            deviceId: device.Id,
            gteq: oneHundredEightyDaysAgo.toISOString().split("T")[0],
        }).then(response => {
            response.deviceId = device.id;
            response.deviceName = device.name;
            response.show = true;
            response.transmissionsArray = response.transmissions
                ? Object.keys(response.transmissions).map(key => {
                      return {
                          x: new Date(key),
                          y: response.transmissions[key],
                      };
                  })
                : [];
            if (response.transmissionsArray.length < 2) {
                response.transmissionsArray.push({
                    x: new Date(),
                    y: null,
                });
            }

            return response;
        });
    };

    const getFailedTransmissions = () => {
        return Promise.all([
            OopCore.getTransmissionStats({
                group: "success",
                gteq: thirtyDaysAgo.toISOString().split("T")[0],
            }),
            OopCore.getTransmissionStats({
                group: "success",
                gteq: oneDayAgo.toISOString().split("T")[0],
            }),
        ]).then(([thirtyDayResponse, oneDayResponse]) => {
            return {
                thirtyDays: thirtyDayResponse.transmissions.false || 0,
                oneDay: oneDayResponse.transmissions.false || 0,
            };
        });
    };

    const getDaysSinceLastTransmissions = () => {
        return OopCore.getTransmissionStats({ filterBy: "date" });
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

    const getData = () => {
        return Promise.all([
            getTransmissionsTimeline(),
            getFailedTransmissions(),
            getDaysSinceLastTransmissions(),
            getGeneralStats(),
        ]).then(
            ([
                transmissionTimeline,
                failedTransmissions,
                daysSinceLastTransmission,
                generalStats,
            ]) => {
                console.log(transmissionTimeline);
                setTransmissionTimeline(transmissionTimeline);
                setFailedTransmissions(failedTransmissions);
                setGeneralStats(generalStats);
            },
        );
    };

    const toggleTransmissionSeries = item => {
        const updatedTransmissionTimeline = transmissionTimeline.map(series => {
            if (series.deviceId === item.id) {
                series.show = !series.show;
            }
            return series;
        });

        setTransmissionTimeline(updatedTransmissionTimeline);
    };

    return (
        <DataProvider
            getData={getData}
            renderData={() => {
                return (
                    <>
                        <div className="mb-20 space-between">
                            <Card className="width-49">
                                <StyledTitle className="center">
                                    Transmissions
                                </StyledTitle>

                                <XYPlot
                                    height={300}
                                    width={800}
                                    xType="time"
                                    stackBy="y"
                                    xDomain={[
                                        oneHundredEightyDaysAgo.getTime(),
                                        now.getTime(),
                                    ]}
                                >
                                    <VerticalGridLines />
                                    <HorizontalGridLines />
                                    <XAxis
                                        tickLabelAngle={-90}
                                        tickFormat={v =>
                                            moment(v).format("DD MMM")
                                        }
                                    />
                                    <YAxis />

                                    {transmissionTimeline.map(series => {
                                        if (series.show) {
                                            return (
                                                <VerticalBarSeries
                                                    data={
                                                        series.transmissionsArray
                                                    }
                                                    key={`vertical-bar-series-${series.deviceId}`}
                                                />
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                                </XYPlot>
                                <DiscreteColorLegend
                                    items={transmissionTimeline.map(series => {
                                        return {
                                            title: series.deviceName,
                                            id: series.deviceId,
                                            disabled: !series.show,
                                        };
                                    })}
                                    onItemClick={item =>
                                        toggleTransmissionSeries(item)
                                    }
                                    orientation="horizontal"
                                />
                            </Card>
                            <Card className="width-49 flex-column">
                                <StyledTitle className="center">
                                    Failed Transmissions
                                </StyledTitle>
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
                            </Card>
                        </div>
                        <div className="space-between">
                            <Card className="width-49">
                                <StyledTitle className="center">
                                    Days since last transmission
                                </StyledTitle>
                                <XYPlot
                                    height={300}
                                    width={800}
                                    xType="time"
                                    stackBy="y"
                                    xDomain={[
                                        thirtyDaysAgo.getTime(),
                                        now.getTime(),
                                    ]}
                                ></XYPlot>
                            </Card>
                            <Card className="width-49 flex-column">
                                <StyledTitle className="center">
                                    Stats
                                </StyledTitle>
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
                            </Card>
                        </div>
                    </>
                );
            }}
        />
    );
};

export { Dashboard };
