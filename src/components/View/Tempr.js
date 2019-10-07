import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import ArrowLeft from "baseui/icon/arrow-left";
import { DataProvider } from "../Universal";
import { Form, InputType } from "../Global";
import OopCore from "../../OopCore";

const Tempr = props => {
    const [tempr, setTempr] = useState({});
    const [updatedTempr, setUpdatedTempr] = useState({});
    const [stateGroups, setGroups] = useState([]);

    const blankTempr = props.match.params.temprId === "new";

    const getTempr = () => {
        return blankTempr
            ? new Promise(function(resolve) {
                  resolve({
                      name: "",
                      description: "",
                      device_group_id: null,
                      body: {
                          language: "javascript",
                          script: "this is the script",
                      },
                  });
              })
            : OopCore.getTempr(
                  props.match.params.deviceGroupId,
                  props.match.params.temprId,
              );
    };

    const getFormData = (temprDetails, groups) => {
        temprDetails.groups = groups.data;
        return temprDetails;
    };

    const getData = () => {
        return Promise.all([getTempr(), OopCore.getDeviceGroups()]).then(
            ([tempr, groups]) => {
                setGroups(groups);
                return getFormData(tempr, groups);
            },
        );
    };

    const refreshTempr = response => {
        const freshData = getFormData(response, stateGroups);
        setTempr(freshData);
        setUpdatedTempr(freshData);
    };

    const allTemprsPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    return (
        <div className="content-wrapper">
            <Button $as={Link} to={allTemprsPath}>
                <ArrowLeft size={24} />
            </Button>
            <h2>Tempr</h2>
            <DataProvider
                getData={() => {
                    return getData().then(response => {
                        setTempr(response);
                        setUpdatedTempr(response);
                        return response;
                    });
                }}
                renderData={() => (
                    <>
                        <Form
                            data={updatedTempr}
                            setData={setUpdatedTempr}
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
                            saveDisabled={
                                blankTempr
                                    ? false
                                    : Object.keys(tempr).every(
                                          key =>
                                              tempr[key] === updatedTempr[key],
                                      )
                            }
                            onSave={() => {
                                const { groups, ...tempr } = updatedTempr;
                                if (blankTempr) {
                                    return OopCore.createTempr(
                                        props.match.params.deviceGroupId,
                                        tempr,
                                    )
                                        .then(response => {
                                            refreshTempr(response);
                                            props.history.replace(
                                                `${allTemprsPath}/${response.id}`,
                                            );
                                        })
                                        .catch(error => {
                                            console.error(error);
                                        });
                                }
                                OopCore.updateTempr(
                                    props.match.params.deviceGroupId,
                                    props.match.params.temprId,
                                    tempr,
                                )
                                    .then(response => refreshTempr(response))
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
