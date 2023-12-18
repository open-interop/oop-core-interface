import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";

import { clearToast, ErrorToast, SuccessToast } from "../Global";
import {
    ConfirmModal,
    DataProvider,
    Page,
} from "../Universal";
import OopCore from "../../OopCore";

import TemprAssociator from "../Global/TemprAssociator";
import AceEditor from "react-ace";

import 'brace/ext/searchbox';

const Layer = props => {
    const [layer, setLayer] = useState({});
    const [updatedLayer, setUpdatedLayer] = useState({});
    const [relations, setRelations] = useState([]);
    const [layerErrors, setLayerErrors] = useState({});

    const blankLayer = props.match.params.layerId === "new";

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
        return (
            updatedLayer.name === layer.name &&
            updatedLayer.reference === layer.reference &&
            updatedLayer.script === layer.script) ||
            !(updatedLayer.name && updatedLayer.reference && updatedLayer.script
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
            return OopCore.getTemprLayers({ filter: { layerId: props.match.params.layerId } })
                .then(res => res.data);
        }
    };

    return (
        <Page
            title={
                blankLayer
                    ? "New Layer | Settings | Open Interop"
                    : "Edit Layer | Settings | Open Interop"
            }
            heading={
                blankLayer
                    ? "Create Layer"
                    : "Edit Layer"
            }
            backlink={props.location.prevPath || "/layers"}
            actions={
                <>
                    {blankLayer ? null : (
                        <Button
                            $as={Link}
                            to={`${props.location.pathname}/audit-logs`}
                            aria-label={"History"}
                        >
                            History
                        </Button>
                    )}
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
                </>
            }
        >
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
                        {blankLayer ||
                        <TemprAssociator
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
        </Page>
    );
};

export default Layer;

