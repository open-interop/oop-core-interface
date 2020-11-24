import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button, KIND } from "baseui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl } from "@fortawesome/free-solid-svg-icons";

import { PaginatedTable, Page, DatetimeTooltip } from "../Universal";
import OopCore from "../../OopCore";
import { useQueryParam, StringParam, NumberParam } from "use-query-params";
import { arrayToObject } from "../../Utilities";

const Messages = props => {

    const [messages, setMessages] = useState([]);
    const [uuid, setUuid] = useQueryParam("uuid", StringParam);
    const [originId, setOriginId] = useQueryParam("originId", NumberParam);
    const [originType, setOriginType] = useQueryParam("originType", StringParam);

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
            setMessages(messages);
            return messages;
        });
    };

    return (
        <Page
            title="Messages | Open Interop"
            heading="Messages"
        >
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
                    return content;
                }}
                columns={[
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
                        id: "createdAt",
                        name: "Created at",
                        type: "text",
                        hasFilter: false,
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
                filters={{ uuid, originId, originType }}
                updateFilters={(key, value) => {
                    switch (key) {
                        case "uuid":
                            return setUuid(value);
                        case "originId":
                            return setOriginId(value);
                        case "originType":
                            return setOriginType(value);
                        default:
                            return null;
                    }
                }}
            />
        </Page>
    );
};

export { Messages };
