import React from "react";
import { useStyletron } from "baseui";
import { styled } from "styletron-react";

const Circle = styled("div", props => ({
    backgroundColor: props.color,
    borderRadius: "50%",
    width: "70%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "4vw",
    color: "white",
    ":after": {
        content: '""',
        display: "block",
        paddingBottom: "100%",
    }
}));

const DataCircle = props => {
    const [css, theme] = useStyletron();

    return (
        <div
            className={css({
                padding: theme.sizing.scale300,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            })}
        >
            <Circle color={props.color}>
                {props.value}
            </Circle>
            <div className="data-subtitle">{props.subtitle}</div>
        </div>
    );
};

export { DataCircle };
