import React, { useState, memo } from "react";
import AceEditor from "react-ace";

import { FormControl } from "baseui/form-control";

const TemprPreview = memo(props => {
    return (
        <FormControl
            label="Example Message"
        >
            <AceEditor
                mode="json"
                theme="kuroir"
                width="100%"
                showPrintMargin={false}
                onChange={props.setValue}
                editorProps={{
                    $blockScrolling: true,
                }}
                value={props.value || ""}
            />
        </FormControl>
    );
});

export { TemprPreview }
