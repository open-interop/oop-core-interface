import React, { useState } from "react";
import AceEditor from "react-ace";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpandArrowsAlt, faCompressArrowsAlt } from "@fortawesome/free-solid-svg-icons";

import { Button, SIZE, KIND } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";
import { Input } from "baseui/input";
import { Select } from "baseui/select";

const languages = [
    { value: "text", label: "Plain Text" },
    { value: "json", label: "JSON Encoded" },
    { value: "mustache", label: "Template Mapping" },
    { value: "js", label: "Scripted Mapping" },
];

const editorTypeMap = {
    mustache: "handlebars",
    json: "json",
    js: "javascript",
};

const TemplateInput = props => {
    const [fullScreen, setFullScreen] = useState(false);

    const allowedLanguages = props.languages || languages.map(l => l.value);

    const language = (props.value && props.value.language) || allowedLanguages[0];
    const script = (props.value && props.value.script) || "";

    const getControlElement = () => {
        if (language === "text" && props.text) {
            return (
                <Cell span={10}>
                    {props.text({ language, script })}
                </Cell>
            );
        }

        if (language === "json" && props.json) {
            return (
                <Cell span={10}>
                    {props.json({ language, script })}
                </Cell>
            );
        }

        if (language === "text") {
            return (
                <Cell span={10}>
                    <Input
                        id={`input-${props.label}`}
                        value={script}
                        onChange={event =>
                            props.onChange({ language, script: event.currentTarget.value })
                        }
                        error={props.error}
                    />
                </Cell>
            );
        }

        return (
            <Cell span={fullScreen ? 12 : 10}>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <AceEditor
                        id="input-host"
                        mode={editorTypeMap[language]}
                        theme="kuroir"
                        showPrintMargin={false}
                        onChange={value => {
                            props.onChange({ language: language, script: value });
                        }}
                        style={{ flex: 1 }}
                        editorProps={{ $blockScrolling: true }}
                        value={String(script)}
                        maxLines={fullScreen ? Infinity : 8}
                        minLines={4}
                    />
                    <Button
                        kind={KIND.tertiary}
                        size={SIZE.large}
                        onClick={() => setFullScreen(!fullScreen)}
                    >
                        <FontAwesomeIcon icon={fullScreen ? faCompressArrowsAlt : faExpandArrowsAlt} />
                    </Button>
                </div>
            </Cell>
        );
    };

    return (
        <FormControl
            label={props.label}
            caption={props.caption}
        >
            <Grid behavior={BEHAVIOR.fluid}>
            {getControlElement()}
            {!fullScreen &&
                <Cell span={2}>
                    <Select
                        required={true}
                        clearable={false}
                        options={languages.filter(l => allowedLanguages.includes(l.value))}
                        valueKey="value"
                        labelKey="label"
                        value={[{ value: language }]}
                        onChange={selected => {
                            props.onChange({ language: selected.option.value, script: script });
                        }}
                        overrides={{
                            DropdownContainer: {
                              style: () => {
                                return {
                                  width: "auto !important",
                                };
                              }
                            }
                        }}
                    />
                </Cell>
            }
        </Grid>
        </FormControl>
    );
};

export default TemplateInput;
