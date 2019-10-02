/* eslint-disable camelcase */
import React, { useState } from "react";
import { DataProvider } from "../Universal";
import { Form } from "../Global";
import OopCore from "../../OopCore";

const Device = props => {
    const [device, setDevice] = useState({});

    const {
        authentication_headers,
        authentication_query,
        ...formData
    } = device;

    return (
        <div className="content-wrapper">
            <DataProvider
                getData={() => {
                    return OopCore.getDevice(props.match.params.deviceId).then(
                        response => {
                            setDevice(response);
                            return response;
                        },
                    );
                }}
                renderData={() => (
                    <>
                        <Form
                            readOnly={true}
                            data={formData}
                            setData={setDevice}
                            dataLabels={
                                new Map([
                                    ["site_id", "Site"],
                                    ["device_group_id", "Group"],
                                    ["name", "Name"],
                                    ["active", "Active"],
                                ])
                            }
                        />
                    </>
                )}
            />
        </div>
    );
};

export { Device };
