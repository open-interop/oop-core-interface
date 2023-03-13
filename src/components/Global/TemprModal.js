import React from "react";

import { Heading, HeadingLevel } from "baseui/heading";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";

import {
    Modal,
    SIZE,
    ROLE
} from "baseui/modal";

import {
    HttpTemprTemplate,
    TemprPreview,
    TemprOutputTest,
} from "../Global";

const TemprModal = props => {
    return (
        <Modal
            overrides={{
                Root: {
                    style: () => ({ position: "fixed", zIndex: "200" })
                }
            }}
            shouldCloseOnOverlayClick={false}
            onClose={props.onClose}
            closeable
            isOpen={true}
            animate
            autoFocus
            size={SIZE.full}
            role={ROLE.dialog}
        >
            <HeadingLevel>
                <Grid behavior={BEHAVIOR.fluid} gridColumns={[6,6,12]}>
                    <Cell span={6}>
                        <Heading>Transmission</Heading>
                        <div style={{ height: "100%", overflowY: "visible" }} >
                            <TemprPreview
                                value={props.exampleTransmission}
                                setValue={props.setExampleTransmission}
                            />
                        </div>
                    </Cell>
                    <Cell span={6}>
                        <Heading>Template</Heading>
                        <div style={{ height: "100%", overflowY: "visible" }} >
                            <HttpTemprTemplate
                                template={props.template}
                                updateTemplate={props.setTemplate}
                                error={props.errors.base}
                            />
                        </div>
                    </Cell>
                    <Cell span={12}>
                        <TemprOutputTest
                            transmission={props.exampleTransmission}
                            template={props.template}
                        />
                    </Cell>
                </Grid>
            </HeadingLevel>
        </Modal>
    );
};

export { TemprModal };
