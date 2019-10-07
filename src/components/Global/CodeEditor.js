import React, { Component } from "react";
import AceEditor from "react-ace";

import "brace/mode/javascript";
import "brace/theme/github";

class CodeEditor extends Component {
    render() {
        return (
            <>
                <AceEditor
                    mode="javascript"
                    theme="github"
                    orientation="below"
                    value={`hi hello`}
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{ $blockScrolling: true }}
                />
            </>
        );
    }
}

export { CodeEditor };
