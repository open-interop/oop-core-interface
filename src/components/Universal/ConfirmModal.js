import React, { useState } from "react";
import { Button, KIND } from "baseui/button";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalButton,
} from "baseui/modal";

const ConfirmModal = props => {
    const [modalOpen, setModalOpen] = useState(false);
    return (
        <>
            <Button kind={KIND.minimal} onClick={() => setModalOpen(true)}>
                {props.buttonText}
            </Button>
            <Modal onClose={() => setModalOpen(false)} isOpen={modalOpen}>
                <ModalHeader>{props.title}</ModalHeader>
                <ModalBody>{props.mainText}</ModalBody>
                <ModalFooter>
                    <ModalButton
                        kind={KIND.tertiary}
                        onClick={() => {
                            if (props.primaryAction) {
                                props.primaryAction();
                                setModalOpen(false);
                            } else {
                                setModalOpen(false);
                            }
                        }}
                    >
                        {props.primaryActionText}
                    </ModalButton>
                    <ModalButton
                        onClick={() =>
                            props.secondaryAction
                                ? props.secondaryAction()
                                : setModalOpen(false)
                        }
                    >
                        {props.secondaryActionText}
                    </ModalButton>
                </ModalFooter>
            </Modal>
        </>
    );
};

export { ConfirmModal };
