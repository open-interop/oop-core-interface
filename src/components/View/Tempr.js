import React, { useState } from "react";
import { Link } from "react-router-dom";
import AceEditor from "react-ace";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Select } from "baseui/select";
import ArrowLeft from "baseui/icon/arrow-left";
import { DataProvider } from "../Universal";
import OopCore from "../../OopCore";

import "brace/mode/json";
import "brace/theme/github";

const Tempr = props => {
    const [tempr, setTempr] = useState({});
    const [updatedTempr, setUpdatedTempr] = useState({});
    const [stateGroups, setGroups] = useState([]);

    const blankTempr = props.match.params.temprId === "new";

    const getTempr = () => {
        return blankTempr
            ? Promise.resolve({
                  name: "",
                  description: "",
                  device_group_id: null,
                  body: {
                      language: "js",
                      script: "",
                  },
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

    const setValue = (key, value) => {
        const updatedData = { ...updatedTempr };
        updatedData[key] = value;
        setUpdatedTempr(updatedData);
    };

    return (
        <div className="content-wrapper">
            <Button $as={Link} to={allTemprsPath}>
                <ArrowLeft size={24} />
            </Button>
            <h2>{blankTempr ? "Create Tempr" : "Edit Tempr"}</h2>
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
                        <FormControl
                            label="Name"
                            key={"form-control-group-name"}
                        >
                            <Input
                                id={"input-name"}
                                value={updatedTempr.name || ""}
                                onChange={event =>
                                    setValue("name", event.currentTarget.value)
                                }
                            />
                        </FormControl>
                        <FormControl
                            label="Group"
                            key={"form-control-group-group"}
                        >
                            <Select
                                options={updatedTempr.groups}
                                labelKey="name"
                                valueKey="id"
                                searchable={false}
                                onChange={event =>
                                    setValue(
                                        "device_group_id",
                                        event.value[0].id,
                                    )
                                }
                                value={updatedTempr.groups.find(
                                    item =>
                                        item.id ===
                                        updatedTempr.device_group_id,
                                )}
                            />
                        </FormControl>
                        <FormControl
                            label="Description"
                            key={"form-control-group-description"}
                        >
                            <Input
                                id={"input-description"}
                                value={updatedTempr.description || ""}
                                onChange={event =>
                                    setValue(
                                        "description",
                                        event.currentTarget.value,
                                    )
                                }
                            />
                        </FormControl>
                        {!blankTempr && (
                            <FormControl
                                label="Device Temprs"
                                key={"form-control-device-temprs"}
                            >
                                <Button
                                    $as={Link}
                                    to={`/device-groups/${updatedTempr.device_group_id}/device-temprs/?temprId=${updatedTempr.id}`}
                                >
                                    Device Temprs
                                </Button>
                            </FormControl>
                        )}

                        <FormControl
                            label="Body"
                            key={"form-control-group-body-example"}
                        >
                            <div className="one-row">
                                <div>
                                    <label>Example</label>
                                    <AceEditor
                                        name="test"
                                        mode="json"
                                        theme="github"
                                        onChange={value =>
                                            setValue(
                                                "example_transmission_body",
                                                value,
                                            )
                                        }
                                        editorProps={{ $blockScrolling: true }}
                                        value={
                                            updatedTempr.example_transmission_body
                                        }
                                    />
                                </div>
                                <div>
                                    <label>Mapping</label>
                                    <AceEditor
                                        mode="json"
                                        theme="github"
                                        onChange={value =>
                                            setValue("body", {
                                                language: "js",
                                                script: value,
                                            })
                                        }
                                        editorProps={{ $blockScrolling: true }}
                                        value={updatedTempr.body.script}
                                    />
                                </div>
                                <div>
                                    <label>Output</label>
                                    <AceEditor
                                        mode="json"
                                        theme="github"
                                        editorProps={{ $blockScrolling: true }}
                                        defaultValue={
                                            updatedTempr.output_transmission_body
                                        }
                                        readOnly
                                    />
                                </div>
                            </div>
                        </FormControl>
                        <Button
                            onClick={() => {
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
                                } else {
                                    OopCore.updateTempr(
                                        props.match.params.deviceGroupId,
                                        props.match.params.temprId,
                                        tempr,
                                    )
                                        .then(response =>
                                            refreshTempr(response),
                                        )
                                        .catch(error => {
                                            console.error(error);
                                        });
                                }
                            }}
                            disabled={
                                blankTempr
                                    ? false
                                    : Object.keys(tempr).every(
                                          key =>
                                              tempr[key] === updatedTempr[key],
                                      )
                            }
                        >
                            {blankTempr ? "Create" : "Save"}
                        </Button>
                        {props.error && <div>{props.error}</div>}
                    </>
                )}
            />
        </div>
    );
};

export { Tempr };
