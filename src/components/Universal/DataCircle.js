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
    fontSize: `${props.fontSize}vw`,
    color: "white",
    ":after": {
        content: '""',
        display: "block",
        paddingBottom: "100%",
    },
}));

const DataCircle = ({ color, value, subtitle }) => {
    const [css, theme] = useStyletron();

    const string = Number(value).toLocaleString();
    const fontSize = 4 - Math.floor((string.length - 1) / 2);

    return (
        <div
            className={css({
                padding: theme.sizing.scale300,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            })}
        >
            <Circle color={color} fontSize={fontSize}>
                {string}
            </Circle>
            <div className="data-subtitle">{subtitle}</div>
        </div>
    );
};

export { DataCircle };
