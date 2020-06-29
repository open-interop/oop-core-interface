import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Button, KIND } from "baseui/button";
import { ListItem, ListItemLabel } from "baseui/list";
import { Card, StyledBody } from "baseui/card";

import JSONPretty from "react-json-pretty";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import { DataProvider, Modal, Page } from "../Universal";
import OopCore from "../../OopCore";


const Transmission = props => {
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [transmission, setTransmission] = useState({});

    const allTransmissionsPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    return (
        <Page
            title="Transmission | Settings | Open Interop"
            heading="Transmission details"
            backlink={allTransmissionsPath}
        >
            <DataProvider
                getData={() => {
                    return OopCore.getTransmission(
                        props.match.params.deviceId,
                        props.match.params.transmissionId,
                    ).then(response => {
                        setTransmission(response);
                        return response;
                    });
                }}
                renderData={() => (
                    <>
                        <Card>
                            <StyledBody>
                                <ListItem>
                                    <div className="card-label">
                                        <ListItemLabel description="Transmission UUID">
                                            {transmission.transmissionUuid ||
                                                "No data available"}
                                        </ListItemLabel>
                                    </div>
                                </ListItem>
                                <ListItem>
                                    <div className="card-label">
                                        <ListItemLabel description="Message UUID">
                                            {transmission.messageUuid ||
                                                "No data available"}
                                        </ListItemLabel>
                                    </div>
                                </ListItem>
                                <ListItem>
                                    <div className="card-label">
                                        <ListItemLabel description="Device ID">
                                            {transmission.deviceId ||
                                                "No data available"}
                                        </ListItemLabel>
                                    </div>
                                </ListItem>
                                <ListItem>
                                    <div className="card-label">
                                        <ListItemLabel description="Tempr ID">
                                            {transmission.temprId ||
                                                "No data available"}
                                        </ListItemLabel>
                                    </div>
                                </ListItem>
                                <ListItem>
                                    <div className="card-label">
                                        <ListItemLabel description="Status">
                                            {transmission.status
                                                ? "Successful"
                                                : "Failed"}
                                        </ListItemLabel>
                                    </div>
                                </ListItem>
                                <ListItem>
                                    <div className="card-label">
                                        <ListItemLabel description="Transmitted at">
                                            {transmission.transmittedAt ||
                                                "No data available"}
                                        </ListItemLabel>
                                    </div>
                                </ListItem>
                                {transmission.requestBody && (
                                    <ListItem>
                                        <Modal
                                            buttonText="View request body"
                                            buttonKind={KIND.secondary}
                                            content={
                                                <JSONPretty
                                                    data={
                                                        transmission.requestBody
                                                    }
                                                />
                                            }
                                        />
                                    </ListItem>
                                )}
                                {transmission.responseBody && (
                                    <ListItem>
                                        <Modal
                                            buttonText="View response body"
                                            buttonKind={KIND.secondary}
                                            content={
                                                <JSONPretty
                                                    data={
                                                        transmission.responseBody
                                                    }
                                                />
                                            }
                                        />
                                    </ListItem>
                                )}
                            </StyledBody>
                        </Card>
                    </>
                )}
            />
        </Page>
    );
};

export { Transmission };
