import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { Popover } from "baseui/popover";

const useOutsideClick = (ref, callback) => {
    const handleClick = e => {
        if (ref.current && !ref.current.contains(e.target)) {
            //callback();
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    });
};

const PopoverWithButton = props => {
    const [popoverOpen, setPopoverOpen] = useState(false);

    const PopoverContent = () => {
        const ref = useRef();

        useOutsideClick(ref, () => {
            setPopoverOpen(false);
        });

        return (
            <div ref={ref} className={props.contentClassName}>
                {props.content}
            </div>
        );
    };

    return (
        <Popover
            isOpen={popoverOpen}
            placement={props.popoverPlacement}
            accessibilityType={"tooltip"}
            content={PopoverContent()}
        >
            <div style={{zIndex: '1'}}>
                <FontAwesomeIcon
                    icon={faFilter}
                    onClick={() => {
                        setPopoverOpen(!popoverOpen);
                    }}
                    color={props.buttonColour}
                />
            </div>
        </Popover>
    );
};

export { PopoverWithButton };
