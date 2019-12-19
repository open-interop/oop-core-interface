import * as React from "react";
import { Button } from "baseui/button";
import {
    Modal as ModalBase,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalButton,
    FocusOnce,
    SIZE,
} from "baseui/modal";

const Modal = props => {
    const [isOpen, setIsOpen] = React.useState(false);
    function close() {
        setIsOpen(false);
    }

    return (
        <>
            <Button
                aria-label="Open modal"
                onClick={() => setIsOpen(true)}
                kind={props.buttonKind}
            >
                {props.buttonText}
            </Button>

            <ModalBase onClose={close} isOpen={isOpen} size={SIZE.auto}>
                <div className="text-modal">
                    <FocusOnce>
                        <ModalHeader>{props.title}</ModalHeader>
                    </FocusOnce>
                    <ModalBody>{props.content}</ModalBody>{" "}
                    {props.secondaryButtonText ||
                        (props.primaryButtonText && (
                            <ModalFooter>
                                {props.secondaryButtonText && (
                                    <ModalButton onClick={close}>
                                        {props.secondaryButtonText}
                                    </ModalButton>
                                )}
                                {props.primaryButtonText && (
                                    <ModalButton onClick={close}>
                                        {props.primaryButtonText}
                                    </ModalButton>
                                )}
                            </ModalFooter>
                        ))}
                </div>
            </ModalBase>
        </>
    );
};

export { Modal };
