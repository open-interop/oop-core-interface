import React, { useState } from "react";
import { DataProvider } from "../Universal";
import { Form } from "../Global";
import OopCore from "../../OopCore";

const Device = props => {
    const [device, setDevice] = useState({});
    const [updatedDevice, setUpdatedDevice] = useState({});

    const getData = () => {
        return Promise.all([
            OopCore.getDevice(props.match.params.deviceId),
            OopCore.getSites(),
            OopCore.getDeviceGroups(),
        ]).then(([deviceDetails, sites, groups]) => {
            deviceDetails.sites = sites.data;
            deviceDetails.groups = groups.data;
            return deviceDetails;
        });
    };

    return (
        <div className="content-wrapper">
            <DataProvider
                getData={() => {
                    return getData().then(response => {
                        setDevice(response);
                        setUpdatedDevice(response);
                        return response;
                    });
                }}
                renderData={() => (
                    <>
                        <Form
                            data={updatedDevice}
                            setData={setUpdatedDevice}
                            dataLabels={
                                new Map([
                                    ["sites", "Site"],
                                    ["groups", "Group"],
                                    ["name", "Name"],
                                    ["active", "Active"],
                                ])
                            }
                            selectedValue={arrayKey => {
                                if (arrayKey === "sites") {
                                    return "site_id";
                                }
                                if (arrayKey === "groups") {
                                    return "device_group_id";
                                }
                            }}
                            onSave={() => {
                                console.log(updatedDevice);
                            }}
                            saveDisabled={Object.keys(device).every(
                                key => device[key] === updatedDevice[key],
                            )}
                        />
                    </>
                )}
            />
        </div>
    );
};

export { Device };
