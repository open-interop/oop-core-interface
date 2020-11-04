import React, { useState } from "react";
import { Button, KIND } from "baseui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl } from "@fortawesome/free-solid-svg-icons";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalButton,
} from "baseui/modal";


import { ListItem, ListItemLabel } from "baseui/list";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";


import { InPlaceGifSpinner } from "../Universal";

const getAction = (changes) => {
    var update = true;
    changes.forEach(change => {
        if (!(change instanceof Array)) {
            update = false;
        }
    });
    return update
}


const formatValue = (val) => {
    if (typeof val === 'string') {
        return val;
    } else {
        return JSON.stringify(val);
    }
}

const itemProps = {
    height: "scale1000",
    display: "flex",
};

const getBody = (changes, updateBool) => {
    const changesArray = [];
    for (const property in changes) {
        var detail;
        if (updateBool) {
            changesArray.push({
                desc: property, 
                initial: formatValue(changes[property][0]),
                current: formatValue(changes[property][1])
            });
        } else {
            changesArray.push({
                desc: property, 
                initial: null,
                current: formatValue(changes[property]),
            });
        }
    }
    return (
        <FlexGrid
            flexGridColumnCount={2}
            flexGridColumnGap="scale400"
            flexGridRowGap="scale1000"
        >
            {changesArray.map(change => (
                updateBool ?
                    <>
                        <FlexGridItem {...itemProps}>
                            <ListItem>
                                <div className="card-label">
                                    <ListItemLabel description={"Old " + change.desc}>
                                        {change.initial ||
                                            "No data available"}
                                    </ListItemLabel>
                                </div>
                            </ListItem>
                        </FlexGridItem>
                        <FlexGridItem {...itemProps}>
                            <ListItem>
                                <div className="card-label">
                                    <ListItemLabel description={"New " + change.desc}>
                                        {change.current ||
                                            "No data available"}
                                    </ListItemLabel>
                                </div>
                            </ListItem>
                        </FlexGridItem>
                    </>
                :
                    <FlexGridItem {...itemProps}>
                        <ListItem>
                            <div className="card-label">
                                <ListItemLabel description={change.desc}>
                                    {change.current ||
                                        "No data available"}
                                </ListItemLabel>
                            </div>
                        </ListItem>
                    </FlexGridItem>
            ))}
        </FlexGrid>
    );
}

const HistoryModal = props => {
    const [modalOpen, setModalOpen] = useState(false);
    const update = getAction(Object.values(props.changes));

    const body = getBody(props.changes, update);
    return (
        <>
            <Button kind={KIND.tertiary} onClick={() => setModalOpen(true)}>
                <FontAwesomeIcon
                    icon={faListUl}
                />
            </Button>
            <Modal 
                onClose={() => setModalOpen(false)} 
                isOpen={modalOpen} 
                overrides={{
                  Dialog: {
                    style: {
                      width: '60%',
                      height: '80%',
                      display: 'flex',
                      flexDirection: 'column',
                    },
                  },
                }}
            >
                <ModalHeader>{props.title}</ModalHeader>
                <ModalBody>
                    {body || 
                        <InPlaceGifSpinner />}
                </ModalBody>
                <ModalFooter>
                    <ModalButton
                        onClick={() => setModalOpen(false)}
                    >
                        Close
                    </ModalButton>
                </ModalFooter>
            </Modal>
        </>
    );
};

export { HistoryModal };
