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

    const formatISODate = (date) => {
        if(date) {
            var b = date.split(/\D+/);
            var date_obj =  new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
            return date_obj.toLocaleString('en-GB', {timeZone: 'UTC'})
        }else{
            return null;
        }
    }

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
                        props.match.params.transmissionId,)
                        .then(transmission => {OopCore.getDevice(transmission.deviceId)
                            .catch(error => {
                                !transmission.errors ? setTransmission(transmission) : setTransmission(null);
                                })
                                .then(device => {OopCore.getTempr(transmission.temprId)
                                    .catch(error => {
                                        !transmission.errors ? setTransmission(transmission) : setTransmission(null);
                                        })
                                        .then(tempr => {
                                            setTransmission(transmission);
                                            setDevice(device);
                                            setTempr(tempr);
                                            return transmission;
                                            })
                                            .catch(error => {
                                                !tempr.status ? setTempr(tempr) : setTempr(null);
                                                !device.status ? setDevice(device) : setDevice(null);
                                                !transmission.errors ? setTransmission(transmission) : setTransmission(null);
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
                                        {device ? <a href={`/devices/${transmission.deviceId}`}>{device.name}</a> : "No data available"}
                                    </ListItemLabel>
                                </div>
                            </ListItem>
                        </FlexGridItem>
                        <FlexGridItem {...itemProps}>
                            <ListItem>
                                <div className="card-label">
                                    <ListItemLabel description="Tempr Name">
                                        {tempr ? <a href={`/temprs/${transmission.temprId}`}>{tempr.name}</a> : "No data available"}
                                    </ListItemLabel>
                                </div>
                            </ListItem>
                        </FlexGridItem>
                        <FlexGridItem {...itemProps}>
                            <ListItem>
                                <div className="card-label">
                                    <ListItemLabel description="Status">
                                        {transmission.success
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
                                        {formatISODate(transmission.transmittedAt) ||
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
                                    minLines={Math.max(transmission.requestBody.split(/\r\n|\r|\n/).length + 2, 8)}
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
                                    minLines={Math.max(transmission.responseBody.split(/\r\n|\r|\n/).length + 2, 8)}
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
