import React from "react";

const Error = props => {
    return <div>{props.message || "Error"}</div>;
};

export { Error };
