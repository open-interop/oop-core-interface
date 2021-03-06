import React, { memo } from "react";
import AceEditor from "react-ace";

import 'brace/ext/searchbox';

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
                maxLines={Infinity}
                minLines={35}
            />
        </FormControl>
    );
});

export { TemprPreview }
