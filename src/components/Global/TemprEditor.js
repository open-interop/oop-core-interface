import React from "react";
import AceEditor from "react-ace";

import "brace/mode/json";
import "brace/theme/github";

const TemprEditor = props => {
    return (
        <>
            <div>{props.title}</div>
            <AceEditor
                mode="json"
                theme="github"
                onChange={value => props.updateText(value)}
                name="UNIQUE_ID_OF_DIV"
                editorProps={{ $blockScrolling: true }}
                value={props.text}
                defaultValue={props.defaultText}
                readOnly={props.defaultText && !props.text && !props.updateText}
            />
        </>
    );
};

export { TemprEditor };
