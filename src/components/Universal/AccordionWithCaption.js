import React from "react";
import { Accordion, Panel } from "baseui/accordion";

const AccordionWithCaption = props => {
    return (
        <div className={`accordion ${props.error ? "error" : ""}`}>
            <Accordion
                initialState={props.startOpen ? { expanded: ["0"] } : null}
            >
                <Panel title={props.title}>
                    <div className="subtitle">{props.subtitle}</div>
                    {props.children}
                </Panel>
            </Accordion>
            {props.error ? (
                <div className="caption error">{props.error}</div>
            ) : (
                props.caption && <div className="caption">{props.caption} </div>
            )}
        </div>
    );
};

export { AccordionWithCaption };
