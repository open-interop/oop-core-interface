import React, { useState } from "react";
import { Button, KIND } from "baseui/button";

import { Modal, ModalHeader, ModalBody, ModalFooter, ModalButton } from "baseui/modal";

import AceEditor from "react-ace";

import "brace/ext/searchbox";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

import { InPlaceGifSpinner } from "../Universal";

const getBody = val => {
    return (
        <AceEditor
            placeholder=""
            mode="json"
            theme="monokai"
            name="requestAce"
            fontSize={14}
            readOnly={true}
            highlightActiveLine={true}
            maxLines={25}
            minLines={Math.max(val.split(/\r\n|\r|\n/).length + 2, 8)}
            value={val}
            style={{ width: "100%" }}
        />
    );
};

const ExpandModal = props => {
    const [modalOpen, setModalOpen] = useState(false);

    const body = getBody(props.content);
    return (
        <>
            <Button kind={KIND.tertiary} onClick={() => setModalOpen(true)}>
                View Value
            </Button>
            <Modal
                onClose={() => setModalOpen(false)}
                isOpen={modalOpen}
                overrides={{
                    Dialog: {
                        style: {
                            width: "60%",
                            height: "80%",
                            display: "flex",
                            flexDirection: "column",
                        },
                    },
                }}
            >
                <ModalHeader>{props.title}</ModalHeader>
                <ModalBody>{body || <InPlaceGifSpinner />}</ModalBody>
                <ModalFooter>
                    <ModalButton onClick={() => setModalOpen(false)}>Close</ModalButton>
                </ModalFooter>
            </Modal>
        </>
    );
};

export { ExpandModal };
