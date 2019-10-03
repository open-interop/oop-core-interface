import React, { useState } from "react";
import { DataProvider } from "../Universal";
import { Form } from "../Global";
import OopCore from "../../OopCore";

const Device = props => {
    const [device, setDevice] = useState({});

    const getData = () => {
        return Promise.all([
            OopCore.getDevice(props.match.params.deviceId),
            OopCore.getSites(),
            OopCore.getDeviceGroups(),
        ]).then(([deviceDetails, sites, groups]) => {
            deviceDetails.sites = sites.data;
            // this is to duplicate the sites results
            deviceDetails.sites[1] = { id: 1, name: "fake name" };
            deviceDetails.groups = groups.data;
            deviceDetails.groups[1] = { id: 1, name: "another group name" };
            return deviceDetails;
        });
    };

    return (
        <div className="content-wrapper">
            <DataProvider
                getData={() => {
                    return getData().then(response => {
                        setDevice(response);
                        return response;
                    });
                }}
                renderData={() => (
                    <>
                        <Form
                            readOnly={true}
                            data={device}
                            setData={setDevice}
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
                        />
                    </>
                )}
            />
        </div>
    );
};

export { Device };
