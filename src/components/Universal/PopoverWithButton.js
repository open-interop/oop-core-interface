import React, { useEffect, useRef, useState } from "react";
import { Popover } from "baseui/popover";

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
            <div>
                <props.ButtonComponent
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
