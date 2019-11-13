import React from "react";
import { useStyletron } from "baseui";
import { Input } from "baseui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function Before() {
    const [useCss, theme] = useStyletron();
    return (
        <div
            className={useCss({
                display: "flex",
                alignItems: "center",
                paddingLeft: theme.sizing.scale500,
            })}
        >
            <FontAwesomeIcon icon={faSearch} />
        </div>
    );
}

const SearchBar = props => {
    const overrides = props.hideSearchIcon ? {} : { Before };

    return (
        <Input
            overrides={overrides}
            value={props.value}
            onChange={e => props.setValue(e.target.value)}
            placeholder={props.placeholder}
            onKeyDown={event => {
                if (props.enterAction) {
                    if (event.keyCode === 13) {
                        props.enterAction(props.value);
                    }
                }
            }}
            clearable={true}
        />
    );
};

export { SearchBar };
