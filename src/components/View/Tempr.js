import React, { useState } from "react";
import { DataProvider } from "../Universal";
import { Form, InputType } from "../Global";
import OopCore from "../../OopCore";

const Tempr = props => {
    const [tempr, setTempr] = useState({});

    const blankTempr = props.match.params.temprId === "new";

    const getTempr = () => {
        return blankTempr
            ? new Promise(function(resolve) {
                  resolve({ name: "", description: "", device_group_id: null });
              })
            : OopCore.getTempr(
                  props.match.params.deviceGroupId,
                  props.match.params.temprId,
              );
    };
    const getData = () => {
        return Promise.all([getTempr(), OopCore.getDeviceGroups()]).then(
            ([tempr, groups]) => {
                tempr.groups = groups.data;
                return tempr;
            },
        );
    };
    return (
        <div className="content-wrapper">
            <h2>Tempr</h2>
            <DataProvider
                getData={() => {
                    return getData().then(response => {
                        setTempr(response);
                        return response;
                    });
                }}
                renderData={() => (
                    <>
                        <Form
                            data={tempr}
                            setData={setTempr}
                            dataTypes={{
                                name: InputType.STRING_INPUT,
                                groups: InputType.SELECT,
                                description: InputType.STRING_INPUT,
                                body: InputType.STRING_INPUT,
                            }}
                            dataLabels={
                                new Map([
                                    ["name", "Name"],
                                    ["groups", "Group"],
                                    ["description", "Description"],
                                    ["body", "Body"],
                                ])
                            }
                            selectedValue={arrayKey => {
                                if (arrayKey === "groups") {
                                    return "device_group_id";
                                }
                            }}
                            buttonText={blankTempr ? "Create" : "Save"}
                            onSave={() => {
                                const { groups, ...updatedTempr } = tempr;
                                if (blankTempr) {
                                    return OopCore.createTempr(
                                        props.match.params.deviceGroupId,
                                        updatedTempr,
                                    )
                                        .then(response => setTempr(response))
                                        .catch(error => {
                                            console.error(error);
                                        });
                                }
                                OopCore.updateTempr(
                                    props.match.params.deviceGroupId,
                                    props.match.params.temprId,
                                    updatedTempr,
                                )
                                    .then(response => setTempr(response))
                                    .catch(error => {
                                        console.error(error);
                                    });
                            }}
                        />
                    </>
                )}
            />
        </div>
    );
};

export { Tempr };
