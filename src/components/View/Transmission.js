import React from "react";

const Transmission = props => {
    return <div>Transmission {props.match.params.transmissionId}</div>;
};

export { Transmission };
