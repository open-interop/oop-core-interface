import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { Button, KIND } from "baseui/button";
import { Checkbox } from "baseui/checkbox";
import { useStyletron } from "baseui";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl } from "@fortawesome/free-solid-svg-icons";

import { PaginatedTable, Page, DatetimeTooltip } from "../Universal";
import OopCore from "../../OopCore";
import { useQueryParam, StringParam, NumberParam, ObjectParam } from "use-query-params";
import { arrayToObject } from "../../Utilities";

const Messages = props => {
    const history = useHistory();

    const [uuid, setUuid] = useQueryParam("uuid", StringParam);
    const [originId, setOriginId] = useQueryParam("originId", NumberParam);
    const [originType, setOriginType] = useQueryParam("originType", StringParam);
    const [ipAddress, setIpAddress] = useQueryParam("ipAddress", StringParam);
    const [createdAt, setCreatedAt] = useQueryParam("createdAt", ObjectParam);

    const [checkedMessages, setCheckedMessages] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [retryingMessages, setRetryingMessages] = useState(false);

    const ItemsSelectedRow = props => {
        const [css, theme] = useStyletron();
    
        return <div className={css({ display: "flex", marginBottom: theme.sizing.scale500, justifyContent: "space-between", alignItems: "center" })} >
            {checkedMessages.length} items selected
            <Button
                kind={KIND.secondary}
                disabled={!checkedMessages.length}
                onClick={onPressConfirm}
                isLoading={retryingMessages}
            >
                Retry
            </Button>
        </div>
    };    

    const onCheckRow = (id) => {
        const newCheckedMessages = [...checkedMessages];
        const index = checkedMessages.indexOf(id)
        if(index !== -1){
            newCheckedMessages.splice(index, 1);
            setAllChecked(false)
        } else {
            newCheckedMessages.push(id)
        }
        setCheckedMessages(newCheckedMessages)
    }

    const onSelectAll = (data) => {
        const newCheckedMessages = [];
        if(allChecked){
            setCheckedMessages([])
        } else {
            for (const item of data){
                newCheckedMessages.push(item.id)
            }
            setCheckedMessages(newCheckedMessages);
        }
        setAllChecked(!allChecked)
    }

    const onPressConfirm = async () => {
        setRetryingMessages(true);
        for(const messageId of checkedMessages){
            await OopCore.retryMessage(messageId);
        }
        history.go(0)
        setRetryingMessages(false);
    }

    const getData = (pagination) => {
        return Promise.all([
            OopCore.getMessages(pagination),
            OopCore.getDevices(),
            OopCore.getSchedules(),
        ]).then(([messages, devices, schedules]) => {
            const devicesObject = arrayToObject(devices.data, "id");
            const schedulesObject = arrayToObject(schedules.data, "id");
            const originDict = {"Device":devicesObject, "Schedule":schedulesObject}

            messages.data.forEach(message => {
                message.origin = originDict[message.originType]
                    && originDict[message.originType][message.originId]
                    ? originDict[message.originType][message.originId].name
                    : "No data available";
            });
            return messages;
        });
    };

    return (
        <Page
            title="Messages | Open Interop"
            heading="Messages"
        >
            <ItemsSelectedRow />
            <PaginatedTable
                getData={getData}
                mapFunction={(columnName, content) => {
                    if (columnName === "action") {
                        return (
                            <>
                                <Button
                                    kind={KIND.tertiary}
                                    $as={Link}
                                    to={`/messages/${content}`}
                                >
                                    <FontAwesomeIcon
                                        icon={faListUl}
                                    />
                                </Button>
                            </>
                        );
                    } 
                    if (columnName === "createdAt") {
                        return (
                            <DatetimeTooltip time={content}></DatetimeTooltip>
                        );
                    }
                    if (columnName === "id") {
                        return (
                            <Checkbox
                                onChange={() => onCheckRow(content)}
                                checked={checkedMessages.indexOf(content) !== -1}
                            />
                        );
                    }
                    return content;
                }}
                columns={[
                    {
                        id: "id",
                        name: "",
                        width: "50px",
                        mapFunction: (data) => {
                            return  <Checkbox
                                onChange={() => onSelectAll(data)}
                                checked={allChecked}
                            />
                        }
                    },
                    {
                        id: "uuid",
                        name: "UUID",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "origin",
                        name: "Origin",
                        type: "text",
                        hasFilter: false,
                    },
                    {
                        id: "originType",
                        name: "Origin Type",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "originId",
                        name: "Origin ID",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "transmissionCount",
                        name: "Transmission Count",
                        type: "text",
                    },
                    {
                        id: "ipAddress",
                        name: "IP Address",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "createdAt",
                        name: "Created at",
                        type: "datetime",
                        hasFilter: true,
                    },
                    {
                        id: "customFieldA",
                        name: "Field A",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "customFieldB",
                        name: "Field B",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "action",
                        name: "",
                        width: "100px",
                    },
                ]}
                columnContent={columnName => {
                    if (columnName === "action") {
                        return "id";
                    }
                    return columnName;
                }}
                filters={{ uuid, originId, originType, ipAddress, createdAt }}
                updateFilters={(key, value) => {
                    switch (key) {
                        case "uuid":
                            return setUuid(value);
                        case "originId":
                            return setOriginId(value);
                        case "originType":
                            return setOriginType(value);
                        case "ipAddress":
                            return setIpAddress(value);
                        case "createdAt":
                            return setCreatedAt(value);
                        default:
                            return null;
                    }
                }}
            />
        </Page>
    );
};

export default Messages;
