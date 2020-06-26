import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, KIND } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import { Input } from "baseui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { clearToast, ErrorToast, SuccessToast } from "../Global";
import {
    ConfirmModal,
    DataProvider,
} from "../Universal";
import OopCore from "../../OopCore";

import TemprAssociator from "../Global/TemprAssociator";
import AceEditor from "react-ace";

const Layer = props => {
    const [layer, setLayer] = useState({});
    const [updatedLayer, setUpdatedLayer] = useState({});
    const [relations, setRelations] = useState([]);
    const [layerErrors, setLayerErrors] = useState({});

    const blankLayer = props.match.params.layerId === "new";

    useEffect(() => {
        document.title = blankLayer
            ? "New Layer | Open Interop"
            : "Edit Layer | Open Interop";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getLayer = () => {
        return blankLayer
            ? Promise.resolve({
                name: "",
                reference: "",
                script: "",
            })
            : OopCore.getLayer(props.match.params.layerId);
    };

    const refreshLayer = response => {
        setLayer(response);
        setUpdatedLayer({ ...response });

        return response;
    };

    const setValue = (key, value) => {
        const updatedData = { ...updatedLayer };
        updatedData[key] = value;
        setUpdatedLayer(updatedData);
    };

    const saveButtonDisabled = () => {
        return !(
            updatedLayer.name &&
            updatedLayer.reference &&
            updatedLayer.script
        );
    };

    const deleteLayer = () => {
        return OopCore.deleteLayer(updatedLayer.id)
            .then(() => {
                props.history.replace(`/layers`);
                SuccessToast("Deleted layer", "Success");
            })
            .catch(error => {
                console.error(error);
                ErrorToast("Could not delete layer", "Error");
            });
    };

    const saveLayer = () => {
        clearToast();
        setLayerErrors({});
        if (blankLayer) {
            return OopCore.createLayer(updatedLayer)
                .then(response => {
                    SuccessToast("Created new layer", "Success");
                    refreshLayer(response);
                    props.history.replace(`/layers/${response.id}`);
                })
                .catch(error => {
                    setLayerErrors(error);
                    ErrorToast("Failed to create layer", "Error");
                });
        } else {
            return OopCore.updateLayer(updatedLayer)
                .then(response => {
                    SuccessToast("Saved layer details", "Success");
                    refreshLayer(response);
                })
                .catch(error => {
                    setLayerErrors(error);
                    ErrorToast("Failed to update layer", "Error");
                });
        }
    };

    const getRelations = () => {
        if (blankLayer) {
            return Promise.resolve([]);
        } else {
            return OopCore.getTemprLayers({ layerId: props.match.params.layerId })
                .then(res => res.data);
        }
    };

    return (
        <div className="content-wrapper">
            <DataProvider
                getData={() => {
                    return Promise.all([
                        getLayer().then(refreshLayer),
                        getRelations().then(setRelations),
                    ])
                }}
                renderKey={props.location.pathname}
                renderData={() => (
                    <>
                        <div className="space-between">
                            <Button
                                $as={Link}
                                kind={KIND.minimal}
                                to={props.location.prevPath || "/layers"}
                                aria-label={
                                    props.location.prevPath
                                        ? "Go back to layers"
                                        : "Go back to layer dashboard"
                                }
                            >
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </Button>
                            <h2>
                                {blankLayer
                                    ? "Create Layer"
                                    : "Edit Layer"}
                            </h2>
                            <div>
                                {blankLayer ? null : (
                                    <ConfirmModal
                                        buttonText="Delete"
                                        title="Confirm Deletion"
                                        mainText={
                                            <>
                                                <div>
                                                    Are you sure you want to
                                                    delete this layer?
                                                </div>
                                                <div>
                                                    This action can't be undone.
                                                </div>
                                            </>
                                        }
                                        primaryAction={deleteLayer}
                                        primaryActionText="Delete"
                                        secondaryActionText="Cancel"
                                    />
                                )}
                                <Button
                                    onClick={saveLayer}
                                    disabled={saveButtonDisabled()}
                                >
                                    {blankLayer ? "Create" : "Save"}
                                </Button>
                            </div>
                        </div>

                        <FormControl
                            label="Name"
                            caption="required"
                            error={
                                layerErrors.name
                                    ? `Name ${layerErrors.name}`
                                    : ""
                            }
                        >
                            <Input
                                id="input-name"
                                value={updatedLayer.name}
                                onChange={event =>
                                    setValue("name", event.currentTarget.value)
                                }
                                error={layerErrors.name}
                            />
                        </FormControl>
                        <FormControl label="Reference">
                            <Input
                                id="input-reference"
                                value={updatedLayer.reference}
                                onChange={event =>
                                    setValue(
                                        "reference",
                                        event.currentTarget.value,
                                    )
                                }
                                error={layerErrors.reference}
                            />
                        </FormControl>
                        <FormControl label="Script">
                            <AceEditor
                                id="input-script"
                                mode="javascript"
                                theme="kuroir"
                                width="100%"
                                showPrintMargin={false}
                                onChange={value => {
                                    setValue("script", value)
                                }}
                                editorProps={{ $blockScrolling: true }}
                                value={updatedLayer.script}
                            />
                        </FormControl>
                        {blankLayer || <TemprAssociator
                            subtitle="Select temprs to associate with this layer."
                            selected={relations}
                            onSelect={tempr => {
                                return OopCore.createTemprLayer({
                                    layerId: layer.id,
                                    temprId: tempr.id,
                                }).then(res => {
                                    setRelations([...relations, res]);
                                });
                            }}
                            onDeselect={(tempr, rel) => {
                                return OopCore.deleteTemprLayer(rel.id, rel).then(
                                    res => {
                                        setRelations(
                                            relations.filter(
                                                v => v.id !== rel.id,
                                            ),
                                        );
                                    },
                                );
                            }}
                        />}
                    </>
                )}
            />
        </div>
    );
};

export { Layer };

