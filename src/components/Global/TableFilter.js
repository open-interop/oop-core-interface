import React from "react";
import { PopoverWithButton, SearchBar } from "../Universal";
import { PLACEMENT } from "baseui/popover";
import { TrueFalseCheckboxes, DatetimeFilter } from ".";

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
                            trueText={props.trueText || "Successful"}
                            falseText={props.falseText || "Unsuccessful"}
                            value={props.filterValue}
                            setValue={value => props.setFilterValue(value)}
                        />
                    )}
                    {props.contentType === "datetime" && (
                        <DatetimeFilter
                            value={props.filterValue}
                            setValue={value => props.setFilterValue(value)}
                        />
                    )}
                </>
            }
            contentClassName="filter-content"
            buttonColour={props.filterValue !== "" ? "black" : "lightgrey"}
        />
    );
};

export { TableFilter };
