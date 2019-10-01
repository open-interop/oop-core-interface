import React from "react";
import { Button } from "baseui/button";
import { PLACEMENT } from "baseui/popover";
import { PopoverWithButton } from "../Universal";

const Modal = props => {
    return (
        <PopoverWithButton
            popoverPlacement={PLACEMENT.auto}
            content={<div>this is the body of the request</div>}
            contentClassName="modal-content"
            ButtonComponent={Button}
            buttonColour={props.filterValue !== "" ? "black" : "lightgrey"}
        />
    );
};

export { Modal };
