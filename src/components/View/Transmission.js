import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";

import 'brace/ext/searchbox';

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

import { KIND, Button } from "baseui/button";
import { ListItem, ListItemLabel } from "baseui/list";
import { Card, StyledBody } from "baseui/card";
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';

import JSONPretty from "react-json-pretty";

import { DataProvider, Modal, Page } from "../Universal";
import OopCore from "../../OopCore";


const Transmission = props => {
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [transmission, setTransmission] = useState({});
    const [device, setDevice] = useState({})
    const [tempr, setTempr] = useState({})

    const [showRequest, setShowRequest] = React.useState(false);

    const [showResponse, setShowResponse] = React.useState(false);

    const allTransmissionsPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    const itemProps = {
      height: 'scale1000',
      display: 'flex'
    };

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
                        ).then(transmission => {OopCore.getDevice(
                            transmission.deviceId
                            ).then(device => {OopCore.getTempr(
                                transmission.temprId
                                ).then(tempr =>{
                                    setDevice(device);
                                    setTempr(tempr);
                                    setTransmission(transmission);
                                    return transmission;
                                })
                            })
                        });
                }}
                renderData={() => (
                    <FlexGrid
                        flexGridColumnCount={[1, 2]}
                        flexGridColumnGap="scale400"
                        flexGridRowGap="scale1000"
                      >
                        <FlexGridItem {...itemProps}>
                            <ListItem>
                                <div className="card-label">
                                    <ListItemLabel description="Transmission UUID">
                                        {transmission.transmissionUuid ||
                                            "No data available"}
                                    </ListItemLabel>
                                </div>
                            </ListItem>
                        </FlexGridItem>
                        <FlexGridItem {...itemProps}>
                            <ListItem>
                                <div className="card-label">
                                    <ListItemLabel description="Message UUID">
                                        {transmission.messageUuid ||
                                            "No data available"}
                                    </ListItemLabel>
                                </div>
                            </ListItem>
                        </FlexGridItem>
                        <FlexGridItem {...itemProps}>
                            <ListItem>
                                <div className="card-label">
                                    <ListItemLabel description="Device ID">
                                        {transmission.deviceId ||
                                            "No data available"}
                                    </ListItemLabel>
                                </div>
                            </ListItem>
                        </FlexGridItem>
                        <FlexGridItem {...itemProps}>
                            <ListItem>
                                <div className="card-label">
                                    <ListItemLabel description="Tempr ID">
                                        {transmission.temprId ||
                                            "No data available"}
                                    </ListItemLabel>
                                </div>
                            </ListItem>
                        </FlexGridItem>
                        <FlexGridItem {...itemProps}>
                            <ListItem>
                                <div className="card-label">
                                    <ListItemLabel description="Device Name">
                                        {device.name || "No data available"}
                                    </ListItemLabel>
                                </div>
                            </ListItem>
                        </FlexGridItem>
                        <FlexGridItem {...itemProps}>
                            <ListItem>
                                <div className="card-label">
                                    <ListItemLabel description="Tempr Name">
                                        {tempr.name || "No data available"}
                                    </ListItemLabel>
                                </div>
                            </ListItem>
                        </FlexGridItem>
                        <FlexGridItem {...itemProps}>
                            <ListItem>
                                <div className="card-label">
                                    <ListItemLabel description="Status">
                                        {transmission.status
                                            ? "Successful"
                                            : "Failed"}
                                    </ListItemLabel>
                                </div>
                            </ListItem>
                        </FlexGridItem>
                        <FlexGridItem {...itemProps}>
                            <ListItem>
                                <div className="card-label">
                                    <ListItemLabel description="Transmitted at">
                                        {transmission.transmittedAt ||
                                            "No data available"}
                                    </ListItemLabel>
                                </div>
                            </ListItem>
                        </FlexGridItem>
                        {transmission.requestBody && (
                            <FlexGridItem {...itemProps}>
                                <Button kind={KIND.secondary} onClick={() => setShowRequest(!showRequest)}>
                                    {showRequest ? "Hide request body" : "View request body"}
                                </Button>
                            </FlexGridItem>
                        )}

                        {transmission.responseBody && (
                            <FlexGridItem {...itemProps}>
                                <Button kind={KIND.secondary} onClick={() => setShowResponse(!showResponse)}>
                                    {showResponse ? "Hide response body" : "View response body"}
                                </Button>
                            </FlexGridItem>
                        )}
                        <FlexGridItem>
                            {showRequest && (
                                <AceEditor
                                    placeholder=""
                                    mode="json"
                                    theme="monokai"
                                    name="requestAce"
                                    fontSize={14}
                                    readOnly={true}
                                    showGutter={true}
                                    highlightActiveLine={true}
                                    maxLines={Infinity}
                                    minLines={6}
                                    value={transmission.requestBody}
                                    style={{ width: '80%' }}
                                />
                            )}
                        </FlexGridItem>
                        <FlexGridItem>
                            {showResponse && (
                                <AceEditor
                                    placeholder=""
                                    mode="json"
                                    theme="monokai"
                                    name="responseAce"
                                    fontSize={14}
                                    readOnly={true}
                                    showGutter={true}
                                    highlightActiveLine={true}
                                    maxLines={Infinity}
                                    minLines={6}
                                    value={transmission.responseBody}
                                    style={{ width: '80%' }}
                                />
                            )}
                        </FlexGridItem>
                    </FlexGrid>
                )}
            />
        </Page>
    );
};

export { Transmission };
