import React, { useState, memo } from "react";
import JSONPretty from "react-json-pretty";
import AceEditor from "react-ace";

import { Button, KIND } from "baseui/button";
import { Tabs, Tab } from "baseui/tabs";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faExpandArrowsAlt,
    faCompressArrowsAlt,
} from "@fortawesome/free-solid-svg-icons";

import { ErrorToast } from "../Global";
import { BaseuiSpinner } from "../Universal";

import OopCore from "../../OopCore";

const TemprPreview = memo(props => {
    const [mappingFullScreen, setMappingFullScreen] = useState(false);

    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);

    const [activeTab, setActiveTab] = useState("0");
    const [fullScreenActiveTab, setFullScreenActiveTab] = useState("0");

    const [rendered, setRendered] = useState(null);

    const calculateOutput = () => {
        setPreviewLoading(true);
        setPreviewVisible(true);
        return OopCore.previewTempr({
            tempr: {
                exampleTransmission: props.value,
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




    const ExampleEditor = () => {
        return (
            <AceEditor
                mode="json"
                theme="kuroir"
                width="100%"
                height={mappingFullScreen ? "75vh" : "500px"}
                showPrintMargin={false}
                onChange={props.setValue}
                editorProps={{
                    $blockScrolling: true,
                }}
                value={props.value}
            />
        );
    };

    if (mappingFullScreen) {
        return (
            <div className="overlay">
                <div className="space-between">
                    <h3>Tempr body</h3>
                    <Button
                        kind={KIND.secondary}
                        onClick={() => {
                            document.body.classList.remove("no-scroll");
                            setMappingFullScreen(false);
                        }}
                    >
                        <FontAwesomeIcon icon={faCompressArrowsAlt} />
                    </Button>
                </div>
                <Tabs
                    onChange={({ activeKey }) => {
                        setFullScreenActiveTab(activeKey);
                    }}
                    activeKey={fullScreenActiveTab}
                >
                    <Tab title="Example Message">{ExampleEditor()}</Tab>
                    <Tab title="Output">
                        <Button
                            kind={KIND.primary}
                            onClick={calculateOutput}
                            isLoading={previewLoading}
                        >
                            Calculate output
                        </Button>
                        {PreviewTemprBox()}
                    </Tab>
                </Tabs>
            </div>
        );
    } else {
        return (
            <>
                <div className="flex-row-reverse">
                    <Button
                        kind={KIND.secondary}
                        onClick={() => {
                            document.body.classList.add("no-scroll");
                            setMappingFullScreen(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faExpandArrowsAlt} />
                    </Button>
                </div>
                <div className="mb-20">
                    <div className="mb-10">Example Message</div>
                    {ExampleEditor()}
                </div>
                <Button
                    kind={KIND.secondary}
                    onClick={calculateOutput}
                    isLoading={previewLoading}
                >
                    Calculate output
                </Button>
                {PreviewTemprBox()}
            </>
        );
    }
});

export { TemprPreview }
