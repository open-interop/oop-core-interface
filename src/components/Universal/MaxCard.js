import React from "react";
import { useStyletron } from "baseui";

import { Card } from "baseui/card";

const MaxCard = props => {
    const [css] = useStyletron();

    return (
        <Card
            className={css({
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            })}
            overrides={{
                Contents: {
                    style: {
                        flex: "1",
                        display: "flex",
                        flexDirection: "column",
                    },
                },
                Body: {
                    style: {
                        flex: "1",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "stretch",
                        flexDirection: "column",
                    },
                },
            }}
            title={props.title}
        >
            {props.children}
        </Card>
    );
};

export { MaxCard };
