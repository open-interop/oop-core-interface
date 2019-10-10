import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { DataProvider } from "../Universal";
import { Form, InputType } from "../Global";
import OopCore from "../../OopCore";
import { Timezones } from "./Timezones";

const Device = props => {
    const [device, setDevice] = useState({});
    const [updatedDevice, setUpdatedDevice] = useState({});
    const [stateSites, setSites] = useState([]);
    const [stateGroups, setGroups] = useState([]);
    const [error, setError] = useState(null);

    const getFormData = (deviceDetails, sites, groups) => {
        deviceDetails.sites = sites.data;
        deviceDetails.groups = groups.data;
        deviceDetails.temprAssociations = (
            <Button
                $as={Link}
                to={`/device-groups/${deviceDetails.device_group_id}/device-temprs/?deviceId=${deviceDetails.id}`}
            >
                Tempr associations
            </Button>
        );
        deviceDetails.timezones = Timezones.map(timezone => {
            return {
                id: timezone,
                name: timezone,
            };
        });
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
                                sites: InputType.SELECT,
                                groups: InputType.SELECT,
                                name: InputType.STRING_INPUT,
                                active: InputType.TOGGLE,
                                timezones: InputType.SEARCHABLE_SELECT,
                                latitude: InputType.STRING_INPUT,
                                longitude: InputType.STRING_INPUT,
                                temprAssociations: InputType.COMPONENT,
                            }}
                            dataLabels={
                                new Map([
                                    ["sites", "Site"],
                                    ["groups", "Group"],
                                    ["name", "Name"],
                                    ["active", "Active"],
                                    ["timezones", "Timezone"],
                                    ["latitude", "Latitude"],
                                    ["longitude", "Longitude"],
                                    ["temprAssociations", "Tempr associations"],
                                ])
                            }
                            targetValue={arrayKey => {
                                if (arrayKey === "sites") {
                                    return "site_id";
                                }
                                if (arrayKey === "groups") {
                                    return "device_group_id";
                                }
                                if (arrayKey === "timezones") {
                                    return "time_zone";
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
