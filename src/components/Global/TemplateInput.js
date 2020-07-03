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
    { value: "text", label: "Basic Mapping" },
    { value: "mustache", label: "Template Mapping" },
    { value: "js", label: "Scripted Mapping" },
];

const editorTypeMap = {
    mustache: "handlebars",
    js: "javascript",
};

const TemplateInput = props => {
    const [fullScreen, setFullScreen] = useState(false);

    const language = (props.value && props.value.language) || "text";
    const script = language === "text" && typeof props.value !== "object" ? props.value : props.value.script || "";

    const getControlElement = () => {
        if (language === "text" && props.basic) {
            return (
                <Cell span={10}>
                    {props.basic({ language, script })}
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
                        height={fullScreen ? "500px" : ""}
                        editorProps={{ $blockScrolling: true }}
                        value={String(script)}
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
                        options={languages}
                        valueKey="value"
                        labelKey="label"
                        value={[{ value: language }]}
                        onChange={selected => {
                            props.onChange({ language: selected.option.value, script: script });
                        }}
                    />
                </Cell>
            }
        </Grid>
        </FormControl>
    );
};

export default TemplateInput;
