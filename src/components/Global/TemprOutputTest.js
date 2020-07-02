import React, { useState, memo } from "react";

import JSONPretty from "react-json-pretty";

import { Button, KIND } from "baseui/button";
import { Tabs, Tab } from "baseui/tabs";
import { BaseuiSpinner } from "../Universal";

import { ErrorToast } from "../Global";

import OopCore from "../../OopCore";

const TemprOutputTest = memo(props => {
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [rendered, setRendered] = useState(null);
    const [activeTab, setActiveTab] = useState("0");

    const PreviewTemprBox = () => {
        if (previewVisible && previewLoading) {
            return (
                <div className="tempr-preview center">
                    <BaseuiSpinner />
                </div>
            );
        }
        if (previewVisible && !previewLoading && rendered) {
            return (
                <div className="tempr-preview">
                    <Tabs
                        onChange={({ activeKey }) => {
                            setActiveTab(activeKey);
                        }}
                        activeKey={activeTab}
                    >
                        <Tab title="Rendered">
                            <JSONPretty
                                className="tempr-preview-content "
                                data={rendered.rendered}
                            />
                        </Tab>
                        <Tab title="Console output">
                            <JSONPretty
                                className="tempr-preview-content "
                                data={
                                    rendered.console ||
                                    "No data to show"
                                }
                            />
                        </Tab>
                        <Tab title="Error output">
                            <JSONPretty
                                className="tempr-preview-content "
                                data={
                                    rendered.error ||
                                    "No data to show"
                                }
                            />
                        </Tab>
                    </Tabs>
                </div>
            );
        }
        return null;
    };

    const calculateOutput = () => {
        setPreviewLoading(true);
        setPreviewVisible(true);
        return OopCore.previewTempr({
            tempr: {
                exampleTransmission: props.transmission,
                template: props.template,
            },
        })
            .then(response => {
                setPreviewLoading(false);
                setRendered(response);
                setActiveTab(response.error ? "2" : "0");
            })
            .catch(error => {
                setPreviewLoading(false);
                console.error(error);
                ErrorToast(
                    "Could not preview example transmission with current mapping",
                    "Error",
                );
            });
    };

    return (
        <>
            <div>
                <Button
                    kind={KIND.secondary}
                    onClick={calculateOutput}
                    isLoading={previewLoading}
                >
                    Calculate output
                </Button>
                {
                    props.showOpenButton &&
                    <Button
                        kind={KIND.secondary}
                        onClick={props.openEditor}
                    >
                        Open Large Editor
                    </Button>
                }
            </div>
            {PreviewTemprBox()}
        </>
    );
});

export { TemprOutputTest };
