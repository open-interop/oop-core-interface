import React from "react";
import { Card, StyledTitle } from "baseui/card";
import { Doughnut, Line, Pie } from "react-chartjs-2";
import { DataCircle, DataProvider } from "../Universal";
import OopCore from "../../OopCore";
import styles from "./../../styles/_variables.scss";

const Dashboard = props => {
    const getTransmissionsByDevice = () => {
        return OopCore.getTransmissionStats({
            deviceId: 36,
            group: "deviceId",
        });
    };

    return (
        <DataProvider
            getData={() => {
                return getTransmissionsByDevice().then(response => {
                    return response;
                });
            }}
            renderData={() => {
                return (
                    <>
                        <div className="mb-20 space-between">
                            <Card className="width-49">
                                <StyledTitle className="center">
                                    Transmissions
                                </StyledTitle>
                                <Line
                                    data={{
                                        labels: ["Success", "Failure"],
                                        datasets: [
                                            {
                                                data: [100, 10],
                                                hoverBackgroundColor: [
                                                    styles.green,
                                                    styles.red,
                                                ],
                                                backgroundColor: [
                                                    styles.green,
                                                    styles.red,
                                                ],
                                            },
                                        ],
                                    }}
                                />
                            </Card>
                            <Card className="width-49 flex-column">
                                <StyledTitle className="center">
                                    Failed Transmissions
                                </StyledTitle>
                                <div className="flex-row">
                                    <DataCircle
                                        value={10}
                                        color={styles.lightBlue}
                                        subtitle="in the last 24 hours"
                                    />
                                    <DataCircle
                                        value={39}
                                        color={styles.orange}
                                        subtitle="in the last 30 days"
                                    />
                                </div>
                            </Card>
                        </div>
                        <div className="space-between">
                            <Card className="width-49">
                                <StyledTitle className="center">
                                    Days since last transmission
                                </StyledTitle>
                                <Line
                                    data={{
                                        labels: ["Success", "Failure"],
                                        datasets: [
                                            {
                                                data: [100, 10],
                                                hoverBackgroundColor: [
                                                    styles.green,
                                                    styles.red,
                                                ],
                                                backgroundColor: [
                                                    styles.green,
                                                    styles.red,
                                                ],
                                            },
                                        ],
                                    }}
                                />
                            </Card>
                            <Card className="width-49 flex-column">
                                <StyledTitle className="center">
                                    Stats
                                </StyledTitle>
                                <div className="flex-row">
                                    <DataCircle
                                        value={10}
                                        color={styles.lightBlue}
                                        subtitle="Device Groups"
                                    />
                                    <DataCircle
                                        value={39}
                                        color={styles.orange}
                                        subtitle="Devices"
                                    />
                                    <DataCircle
                                        value={39}
                                        color={styles.orange}
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
