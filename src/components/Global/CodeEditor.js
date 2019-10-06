import React, { Component } from "react";
import SplitEditor from "react-ace";

import "brace/mode/json";
import "brace/theme/github";

class CodeEditor extends Component {
    render() {
        return (
            <SplitEditor
                mode="json"
                theme="github"
                splits={2}
                orientation="below"
                value={[`hi hello`, "what"]}
                name="UNIQUE_ID_OF_DIV"
                editorProps={{ $blockScrolling: true }}
            />
        );
    }
}

export { CodeEditor };
