import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AceEditor from "react-ace";

import "brace/ext/searchbox";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

import { KIND, Button } from "baseui/button";
import { ListItem, ListItemLabel } from "baseui/list";
import { Card, StyledBody } from "baseui/card";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Heading, HeadingLevel } from "baseui/heading";
import { Input } from "baseui/input";
import { TreeView, TreeLabel, toggleIsExpanded } from "baseui/tree-view";
import { arrayToObject } from "../../Utilities";

import JSONPretty from "react-json-pretty";

import {
    DataProvider,
    MaxCard,
    InPlaceGifSpinner,
    Modal,
    Page,
    DatetimeTooltip,
    TransmissionTree,
} from "../Universal";

import OopCore from "../../OopCore";

const Message = props => {
    const [message, setMessage] = useState();
    const [transmissions, setTransmissions] = useState();
    const [originChildren, setOriginChildren] = useState();
    const [showBody, setShowBody] = React.useState();
    const [treeData, setTreeData] = useState([]);

    const [body, setBody] = useState("");
    const [originName, setOriginName] = useState("");

    const allMessagesPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    const itemProps = {
        height: "scale1000",
        display: "flex",
    };

    const wideItemProps = {
        ...itemProps,
        overrides: {
            Block: {
                style: ({ $theme }) => ({
                    width: `calc((200% - ${$theme.sizing.scale800}) / 3)`,
                }),
            },
        },
    };

    async function getOriginName(message) {
        if (message.originType === "Device") {
            try {
                const dev = await OopCore.getDevice(message.originId);
                return dev.name;
            } catch (err) {
                return null;
            }
        } else {
            try {
                const sched = await OopCore.getSchedule(message.originId);
                return sched.name;
            } catch (err) {
                return null;
            }
        }
    }

    async function getOriginChildren(originType, originId, transmissionArray) {
        var originTemprs;
        if (originType == "Device") {
            originTemprs = await OopCore.getDeviceTemprs({
                "filter[device_id]": originId,
            });
        } else {
            originTemprs = await OopCore.getScheduleTemprs({
                "filter[schedule_id]": originId,
            });
        }

        var children = originTemprs.data;
        const transmissionObject = arrayToObject(
            transmissionArray.data,
            "temprId",
        );

        if (children.length === 0) {
            return null;
        }

        async function getChildren(child, depth) {
            if (!child.name) {
                try {
                    var temprObject = await OopCore.getTempr(child.temprId);
                    child = temprObject;
                } catch (err) {
                    return null;
                }
            }
            var childrenOfChild = await OopCore.getTemprs({
                "filter[tempr_id]": child.id,
            });
            var allChildren = null;

            if (childrenOfChild.data.length > 0) {
                allChildren = await Promise.all(
                    childrenOfChild.data.map(newChild =>
                        getChildren(newChild, depth + 1),
                    ),
                );
            }

            var node;

            if (transmissionObject[child.id]) {
                node = {
                    id: child.id,
                    name: child.name,
                    depth: depth,
                    isExpanded: false,
                    transmissionMade: true,
                    messageUuid: transmissionObject[child.id].transmissionUuid,
                    status: transmissionObject[child.id].status,
                    transmittedAt: transmissionObject[child.id].transmittedAt,
                    transmissionId: transmissionObject[child.id].id,
                    messageId: props.match.params.messageId,
                };
            } else {
                node = {
                    id: child.id,
                    name: child.name,
                    depth: depth,
                    isExpanded: false,
                    transmissionMade: false,
                    messageId: props.match.params.messageId,
                };
            }

            if (allChildren) {
                node.children = allChildren;
            }

            return node;
        }

        var temprHierarchy = await Promise.all(
            children.map(child => getChildren(child, 1)),
        );

        return temprHierarchy;
    }

    const TransmissionsDisplay = props => {
        return (
            <div>
                <HeadingLevel>
                    <HeadingLevel>
                        <Heading>Transmissions</Heading>
                    </HeadingLevel>
                </HeadingLevel>
                <TransmissionTree initialData={props.data} />
            </div>
        );
    };

    return (
        <Page
            title="Message | Open Interop"
            heading="Message details"
            backlink={allMessagesPath}
        >
            <DataProvider
                getData={() => {
                    return OopCore.getMessage(
                        props.match.params.messageId,
                    ).then(message => {
                        OopCore.getTransmissionsByMessage(
                            message.uuid,
                            {},
                        ).then(transmissions => {
                            getOriginChildren(
                                message.originType,
                                message.originId,
                                transmissions,
                            ).then(origins => {
                                getOriginName(message).then(originName => {
                                    setOriginName(originName);
                                    setOriginChildren(origins);
                                    const b =
                                        Object.keys(message.body).length ===
                                            0 &&
                                        message.body.constructor === Object
                                            ? null
                                            : message.body;
                                    setBody(b);
                                    setTransmissions(transmissions);
                                    setMessage(message);
                                    return message;
                                });
                            });
                        });
                    });
                }}
                renderData={() => (
                    <>
                        {message && originChildren ?
                            <>
                                <FlexGrid
                                    flexGridColumnCount={[1,1,1,2]}
                                    flexGridRowGap="scale800"
                                    marginBottom="scale1000"
                                >
                                    <FlexGridItem {...itemProps}>
                                        <ListItem>
                                            <div className="card-label">
                                                <ListItemLabel description="UUID">
                                                    {message && message.uuid ? message.uuid :
                                                        "No data available"}
                                                </ListItemLabel>
                                            </div>
                                        </ListItem>
                                    </FlexGridItem>
                                    {(message && message.originType) && (
                                        <FlexGridItem {...itemProps}>
                                            <ListItem>
                                                <div className="card-label">
                                                    <ListItemLabel
                                                        description={message && message.originType ? message.originType : "Origin"}
                                                    >
                                                        {originName ||
                                                            "No data available"}
                                                    </ListItemLabel>
                                                </div>
                                            </ListItem>
                                        </FlexGridItem>
                                    )}
                                    <FlexGridItem {...itemProps}>
                                        <ListItem>
                                            <div className="card-label">
                                                <ListItemLabel description="Created At">
                                                    {message && message.createdAt ? message.createdAt :
                                                        "No data available"}
                                                </ListItemLabel>
                                            </div>
                                        </ListItem>
                                    </FlexGridItem>
                                    <FlexGridItem {...itemProps}>
                                        <ListItem>
                                            <div className="card-label">
                                                <ListItemLabel description="IP Address">
                                                    {message && message.ipAddress ? message.ipAddress :
                                                        "No data available"}
                                                </ListItemLabel>
                                            </div>
                                        </ListItem>
                                    </FlexGridItem>
                                </FlexGrid>
                                <FlexGrid
                                    flexGridColumnCount={3}
                                    flexGridRowGap="scale800"
                                    marginBottom="scale800"
                                >
                                    {body && (
                                        <FlexGridItem {...wideItemProps}>
                                            <Button
                                                kind={KIND.secondary}
                                                onClick={() => setShowBody(!showBody)}
                                            >
                                                {showBody
                                                    ? "Hide Message Body"
                                                    : "View Message Body"}
                                            </Button>
                                        </FlexGridItem>
                                    )}
                                    <FlexGridItem display="none"></FlexGridItem>
                                    <FlexGridItem {...itemProps}>
                                        <Button
                                            kind={KIND.secondary}
                                            $as={Link}
                                            to={allMessagesPath}
                                        >
                                            {"Back to message list"}
                                        </Button>
                                    </FlexGridItem>
                                </FlexGrid>
                                {showBody && (
                                    <>
                                        <h2>Message Body</h2>
                                        <AceEditor
                                            placeholder=""
                                            mode="json"
                                            theme="monokai"
                                            name="responseAce"
                                            fontSize={14}
                                            readOnly={true}
                                            highlightActiveLine={true}
                                            maxLines={25}
                                            minLines={8}
                                            value={
                                                typeof body === "string"
                                                    ? body
                                                    : JSON.stringify(body, null, 4)
                                            }
                                            style={{ width: "100%" }}
                                        />
                                    </>
                                )}
                                <TransmissionsDisplay data={originChildren} />
                            </> 
                            :
                            <InPlaceGifSpinner />
                        }
                    </>
                )}
            />
        </Page>
    );
};

export { Message };
