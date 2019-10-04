import React, { useState } from "react";
import { DataProvider } from "../Universal";
import { Form, TYPE } from "../Global";
import OopCore from "../../OopCore";

const Device = props => {
    const [device, setDevice] = useState({});
    const [updatedDevice, setUpdatedDevice] = useState({});
    const [stateSites, setSites] = useState([]);
    const [stateGroups, setGroups] = useState([]);
    const [error, setError] = useState(null);

    const getFormData = (deviceDetails, sites, groups) => {
        deviceDetails.sites = sites.data;
        deviceDetails.groups = groups.data;
        return deviceDetails;
    };

    const getData = () => {
        return Promise.all([
            OopCore.getDevice(props.match.params.deviceId),
            OopCore.getSites(),
            OopCore.getDeviceGroups(),
        ]).then(([deviceDetails, sites, groups]) => {
            setSites(sites);
            setGroups(groups);
            return getFormData(deviceDetails, sites, groups);
        });
    };

    const updateState = response => {
        setDevice(response);
        setUpdatedDevice(response);
        return response;
    };

    return (
        <div className="content-wrapper">
            <DataProvider
                getData={() => {
                    return getData().then(data => updateState(data));
                }}
                renderData={() => (
                    <>
                        <Form
                            data={updatedDevice}
                            setData={setUpdatedDevice}
                            dataTypes={{
                                sites: TYPE.SELECT,
                                groups: TYPE.SELECT,
                                name: TYPE.STRING_INPUT,
                                active: TYPE.TOGGLE,
                            }}
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
                                const {
                                    sites,
                                    groups,
                                    ...device
                                } = updatedDevice;
                                OopCore.updateDevice(device)
                                    .then(response =>
                                        updateState(
                                            getFormData(
                                                response,
                                                stateSites,
                                                stateGroups,
                                            ),
                                        ),
                                    )
                                    .catch(error => {
                                        console.error(error);
                                        setError(
                                            "Something went wrong while attepting to save device details",
                                        );
                                    });
                            }}
                            saveDisabled={Object.keys(device).every(
                                key => device[key] === updatedDevice[key],
                            )}
                            error={error}
                        />
                    </>
                )}
            />
        </div>
    );
};

export { Device };
