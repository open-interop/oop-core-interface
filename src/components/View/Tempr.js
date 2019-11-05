import React, { useState } from "react";
import { Link } from "react-router-dom";
import AceEditor from "react-ace";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Select } from "baseui/select";
import ArrowLeft from "baseui/icon/arrow-left";
import { AccordionWithCaption, DataProvider } from "../Universal";
import {
    clearToast,
    ErrorToast,
    HttpTemprTemplate,
    SuccessToast,
} from "../Global";
import { identicalObject } from "../../Utilities";
import OopCore from "../../OopCore";

import "brace/mode/json";
import "brace/theme/github";

const Tempr = props => {
    const [tempr, setTempr] = useState({});
    const [updatedTempr, setUpdatedTempr] = useState({});
    const [temprErrors, setTemprErrors] = useState({});
    const [groups, setGroups] = useState([]);

    const blankTempr = props.match.params.temprId === "new";

    const getTempr = () => {
        return blankTempr
            ? Promise.resolve({
                  name: "",
                  description: "",
                  deviceGroupId: Number(props.match.params.deviceGroupId),
                  body: {
                      language: "js",
                      script: "",
                  },
                  template: {
                      headers: {},
                      host: "",
                      path: "",
                      port: 0,
                      protocol: "",
                      requestMethod: "",
                  },
              })
            : OopCore.getTempr(props.match.params.temprId);
    };

    const getData = () => {
        return Promise.all([getTempr(), OopCore.getDeviceGroups()]).then(
            ([tempr, groups]) => {
                setGroups(groups.data);
                refreshTempr(tempr);
                return tempr;
            },
        );
    };

    const refreshTempr = response => {
        setTempr(response);
        setUpdatedTempr(response);
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

    const canMoveTempr = () => {
        setTemprErrors({ ...temprErrors, moveGroupError: "" });
        if (blankTempr) {
            return Promise.resolve(true);
        } else {
            return OopCore.getDeviceTemprs({
                temprId: updatedTempr.id,
            }).then(response => {
                if (response.data.length) {
                    setTemprErrors({
                        moveGroupError:
                            "This tempr can't be moved to another group because it's currently used in a device tempr",
                    });
                    return false;
                } else {
                    setTemprErrors({ ...temprErrors, moveGroupError: "" });
                    return true;
                }
            });
        }
    };

    return (
        <div className="content-wrapper">
            <Button $as={Link} to={allTemprsPath}>
                <ArrowLeft size={24} />
            </Button>

            <h2>{blankTempr ? "Create Tempr" : "Edit Tempr"}</h2>
            <DataProvider
                getData={() => {
                    return getData();
                }}
                renderData={() => (
                    <>
                        <FormControl
                            label="Name"
                            key={"form-control-group-name"}
                            error={
                                temprErrors.name
                                    ? `Name ${temprErrors.name}`
                                    : ""
                            }
                            caption="required"
                        >
                            <Input
                                id={"input-name"}
                                value={updatedTempr.name || ""}
                                onChange={event =>
                                    setValue("name", event.currentTarget.value)
                                }
                                error={temprErrors.name}
                            />
                        </FormControl>
                        <FormControl
                            label="Group"
                            key={"form-control-group-group"}
                            error={
                                temprErrors.moveGroupError ||
                                temprErrors.deviceGroup
                            }
                            caption="required"
                        >
                            <Select
                                options={groups}
                                labelKey="name"
                                valueKey="id"
                                searchable={false}
                                clearable={false}
                                onChange={event => {
                                    canMoveTempr().then(canMove => {
                                        if (canMove && event.value.length) {
                                            setValue(
                                                "deviceGroupId",
                                                event.value[0].id,
                                            );
                                        }
                                    });
                                }}
                                value={groups.filter(
                                    item =>
                                        item.id === updatedTempr.deviceGroupId,
                                )}
                                error={temprErrors.deviceGroup}
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
                        <AccordionWithCaption
                            title="Template"
                            caption="required"
                            error={temprErrors.base}
                            subtitle="Please provide a host, port, path, protocol and request method"
                        >
                            <div className="content-wrapper">
                                <HttpTemprTemplate
                                    template={updatedTempr.template}
                                    updateTemplate={value =>
                                        setValue("template", value)
                                    }
                                    error={temprErrors.base}
                                />
                            </div>
                        </AccordionWithCaption>
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
                                                "exampleTransmissionBody",
                                                value,
                                            )
                                        }
                                        editorProps={{ $blockScrolling: true }}
                                        value={
                                            updatedTempr.exampleTransmissionBody
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
                                            updatedTempr.outputTransmissionBody
                                        }
                                        readOnly
                                    />
                                </div>
                            </div>
                        </FormControl>
                        <Button
                            onClick={() => {
                                clearToast();
                                setTemprErrors({});
                                if (blankTempr) {
                                    return OopCore.createTempr(updatedTempr)
                                        .then(response => {
                                            SuccessToast(
                                                "Created new tempr",
                                                "Success",
                                            );
                                            refreshTempr(response);
                                            props.history.replace(
                                                `/temprs/${response.id}`,
                                            );
                                        })
                                        .catch(error => {
                                            setTemprErrors(error);
                                            ErrorToast(
                                                "Failed to create tempr",
                                                "Error",
                                            );
                                        });
                                } else {
                                    OopCore.updateTempr(
                                        props.match.params.temprId,
                                        updatedTempr,
                                    )
                                        .then(response => {
                                            refreshTempr(response);
                                            SuccessToast(
                                                "Updated tempr",
                                                "Success",
                                            );
                                        })
                                        .catch(error => {
                                            setTemprErrors(error);
                                            ErrorToast(
                                                "Failed to update tempr",
                                                "Error",
                                            );
                                        });
                                }
                            }}
                            disabled={identicalObject(tempr, updatedTempr)}
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
