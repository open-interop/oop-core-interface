import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import AceEditor from "react-ace";

import "brace/ext/searchbox";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

import { KIND, Button } from "baseui/button";
import { ListItem, ListItemLabel } from "baseui/list";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Heading, HeadingLevel } from "baseui/heading";
import { arrayToObjectArray } from "../../Utilities";

import {
    DataProvider,
    InPlaceGifSpinner,
    Page,
    TransmissionTree,
} from "../Universal";

import OopCore from "../../OopCore";

const Message = props => {
    const history = useHistory();

    const [message, setMessage] = useState();
    const [originChildren, setOriginChildren] = useState();
    const [showBody, setShowBody] = React.useState();

    const [body, setBody] = useState("");
    const [originName, setOriginName] = useState("");

    const [retrying, setRetrying] = useState(null);

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
        if (originType === "Device") {
            originTemprs = await OopCore.getDeviceTemprs({
                "filter[device_id]": originId,
            });
        } else {
            originTemprs = await OopCore.getScheduleTemprs({
                "filter[schedule_id]": originId,
            });
        }

        var children = originTemprs.data;
        const transmissionObject = arrayToObjectArray(
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

            var allChildren = [];

            if (childrenOfChild.data.length > 0) {
                for (const newChild of childrenOfChild.data) {
                  let childNode = await getChildren(newChild, depth + 1);

                  allChildren.push(...childNode)
                }
            }

            var node = [];

            const nodeObj = {
                id: 1,
                temprId: child.id,
                name: child.name,
                depth: depth,
                isExpanded: false,
                messageId: props.match.params.messageId,
            }

            if (allChildren) {
                nodeObj.children = allChildren;
            }

            if (transmissionObject[child.id]) {
                if(Array.isArray(transmissionObject[child.id])){
                    for(const transmission of transmissionObject[child.id]){
                        node.push({
                            ...nodeObj,
                            id: transmission.id,
                            transmissionUuid: transmission.transmissionUuid,
                            status: transmission.status,
                            transmittedAt: transmission.transmittedAt,
                            transmissionId: transmission.id,
                            transmissionMade: true
                        })
                    }
                } else {
                    node.push({
                        ...nodeObj,
                        id: transmissionObject[child.id],
                        transmissionUuid: transmissionObject[child.id].transmissionUuid,
                        status: transmissionObject[child.id].status,
                        transmittedAt: transmissionObject[child.id].transmittedAt,
                        transmissionId: transmissionObject[child.id].id,
                    })
                }
            } else {
                node.push(nodeObj)
            }

            return node;
        }


        var temprHierarchy = [];

        for(const child of children){
            const childArray = await getChildren(child, 1);

            temprHierarchy.push(...childArray)
        }

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

    const RetryButton = props => {
        return(
            <Button
                kind={KIND.secondary}
                onClick={retryMessage}
                isLoading={retrying}
                disabled={retrying !== null}
            >
                {retrying === null ? "Retry" : "Retried"}
            </Button>
)
    }

    async function retryMessage() {
        setRetrying(true);
        await OopCore.retryMessage(message.id);
        setRetrying(false);
    }

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
                                    <FlexGridItem {...itemProps}>
                                        <ListItem>
                                            <div className="card-label">
                                                <ListItemLabel description="State">
                                                    {message && message.state ? OopCore.capitalise(message.state) :
                                                        "No data available"}
                                                </ListItemLabel>
                                            </div>
                                        </ListItem>
                                    </FlexGridItem>
                                    <FlexGridItem {...itemProps}>
                                        <ListItem>
                                            <div className="card-label">
                                                <ListItemLabel description="Retried At">
                                                    {message && message.retriedAt ? message.retriedAt :
                                                        "Not retried"}
                                                </ListItemLabel>
                                            </div>
                                        </ListItem>
                                    </FlexGridItem>
                                    {(message?.customFieldA) &&
                                        <>
                                            <FlexGridItem {...itemProps}>
                                                <ListItem>
                                                    <div className="card-label">
                                                        <ListItemLabel description="Field A">
                                                            {message.customFieldA ?? "No data available"}
                                                        </ListItemLabel>
                                                    </div>
                                                </ListItem>
                                            </FlexGridItem>
                                        </>
                                    }
                                    {(message?.customFieldB) &&
                                        <>
                                            <FlexGridItem {...itemProps}>
                                                <ListItem>
                                                    <div className="card-label">
                                                        <ListItemLabel description="Field B">
                                                            {message.customFieldB ?? "No data available"}
                                                        </ListItemLabel>
                                                    </div>
                                                </ListItem>
                                            </FlexGridItem>
                                        </>
                                    }
                                </FlexGrid>
                                <FlexGrid
                                    flexGridColumnCount={3}
                                    flexGridRowGap="scale800"
                                    marginBottom="scale800"
                                >
                                    {body ? (
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
                                    ) : !message?.retriedAt && (
                                        <FlexGridItem {...itemProps}>
                                            <RetryButton />
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
                                {body && !message?.retriedAt &&
                                    <FlexGrid>
                                        <RetryButton />
                                    </FlexGrid>
                                }
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

export default Message;
