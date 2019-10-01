import React from "react";
import Filter from "baseui/icon/filter";
import { PopoverWithButton, SearchBar } from "../Universal";
import { PLACEMENT } from "baseui/popover";
import { TrueFalseCheckboxes } from ".";

const TableFilter = props => {
    return (
        <PopoverWithButton
            popoverPlacement={PLACEMENT.bottomRight}
            content={
                <>
                    {props.contentType === "text" && (
                        <SearchBar
                            value={props.filterValue}
                            setValue={value => props.setFilterValue(value)}
                            placeholder="Search"
                        />
                    )}
                    {props.contentType === "bool" && (
                        <TrueFalseCheckboxes
                            trueText="Successful"
                            falseText="Unsuccessful"
                            value={props.filterValue}
                            setValue={value => props.setFilterValue(value)}
                        />
                    )}
                </>
            }
            contentClassName="filter-content"
            ButtonComponent={Filter}
            buttonColour={props.filterValue !== "" ? "black" : "lightgrey"}
        />
    );
};

export { TableFilter };
