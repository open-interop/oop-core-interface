import React, { useEffect, useRef, useState } from "react";
import Filter from "baseui/icon/filter";
import { SearchBar } from ".";
import { PLACEMENT, Popover } from "baseui/popover";
import { TrueFalseCheckboxes } from "./TrueFalseCheckboxes";

const useOutsideClick = (ref, callback) => {
    const handleClick = e => {
        if (ref.current && !ref.current.contains(e.target)) {
            callback();
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    });
};

const TableFilter = props => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const PopoverContent = () => {
        const ref = useRef();

        useOutsideClick(ref, () => {
            setPopoverOpen(false);
        });

        if (props.contentType === "text") {
            return (
                <div ref={ref} className="filter-content">
                    <SearchBar
                        value={props.filterValue}
                        setValue={value => props.setFilterValue(value)}
                        placeholder="Search"
                    />
                </div>
            );
        }

        if (props.contentType === "bool") {
            return (
                <div ref={ref} className="filter-content">
                    <TrueFalseCheckboxes
                        trueText="Successful"
                        falseText="Unsuccessful"
                        value={props.filterValue}
                        setValue={value => props.setFilterValue(value)}
                    />
                </div>
            );
        }
        return <div> this is not text content</div>;
    };

    return (
        <>
            <Popover
                isOpen={popoverOpen}
                dismissOnEsc={true}
                placement={PLACEMENT.bottomRight}
                accessibilityType={"tooltip"}
                content={PopoverContent()}
            >
                <div className="filter-button">
                    <Filter
                        onClick={() => {
                            setPopoverOpen(!popoverOpen);
                        }}
                        color={props.filterValue !== "" ? "black" : "lightgrey"}
                    />
                </div>
            </Popover>
        </>
    );
};

export { TableFilter };
