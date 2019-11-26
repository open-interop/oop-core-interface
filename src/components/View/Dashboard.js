import React from "react";
import { DataProvider } from "../Universal";
import OopCore from "../../OopCore";

const Dashboard = props => {
    const getTransmissionsByDevice = () => {
        return OopCore.getTransmissionStats({ group: "deviceId" });
    };
    return (
        <DataProvider
            getData={() => {
                return getTransmissionsByDevice().then(response => {
                    return response;
                });
            }}
            renderData={() => {
                return <div>this is the dashboard</div>;
            }}
        />
    );
};

export { Dashboard };
