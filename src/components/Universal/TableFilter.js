import React, { useState } from "react";
import Filter from "baseui/icon/filter";
import { PLACEMENT, StatefulPopover } from "baseui/popover";

const TableFilter = props => {
    const PopoverContent = () => {
        if (props.contentType === "text") {
            return <div>this is the content</div>;
        }
        return <div> this is not text content</div>;
    };
    return (
        <>
            <StatefulPopover
                dismissOnEsc={true}
                dismissOnClickOutside={true}
                placement={PLACEMENT.bottomRight}
                accessibilityType={"tooltip"}
                content={PopoverContent()}
            >
                <div>
                    <Filter />
                </div>
            </StatefulPopover>
        </>
    );
};

export { TableFilter };
