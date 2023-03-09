import React, { useEffect } from "react";

import { Link } from "react-router-dom";
import { useQueryParam, StringParam, ObjectParam } from "use-query-params";

import { Button, KIND } from "baseui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

import { PaginatedTable, Page, DatetimeTooltip } from "../Universal";
import OopCore from "../../OopCore";

const Transmissions = props => {
    useEffect(() => {
        document.title = "Transmissions | Open Interop";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [id, setId] = useQueryParam("id", StringParam);
    const [deviceId, setDeviceId] = useQueryParam("deviceId", StringParam);
    const [transmissionUuid, setTransmissionUuid] = useQueryParam("transmissionUuid", StringParam);
    const [messageUuid, setMessageUuid] = useQueryParam("messageUuid", StringParam);
    const [status, setStatus] = useQueryParam("status", StringParam);
    const [success, setSuccess] = useQueryParam("success", StringParam);
    const [transmittedAt, setTransmittedAt] = useQueryParam("transmittedAt", ObjectParam);

    const deviceDashboardPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    return (
        <Page heading="Transmissions" backlink={deviceDashboardPath}>
            <PaginatedTable
                getData={pagination => {
                    return OopCore.getTransmissions(pagination);
                }}
                mapFunction={(columnName, content) => {
                    if (columnName === "action") {
                        return (
                            <Button
                                kind={KIND.tertiary}
                                $as={Link}
                                to={`/transmissions/${content}`}
                                aria-label="View transmission details"
                            >
                                View
                            </Button>
                        );
                    }

                    if (columnName === "success") {
                        return content ? (
                            <FontAwesomeIcon icon={faCheck} />
                        ) : (
                            <FontAwesomeIcon icon={faTimes} />
                        );
                    }

                    if (columnName === "deviceId") {
                        return content || "N/A";
                    }

                    if (columnName === "scheduleId") {
                        return content || "N/A";
                    }

                    if (columnName === "transmittedAt") {
                        return <DatetimeTooltip time={content}></DatetimeTooltip>;
                    }
                    return content;
                }}
                columnContent={columnName => {
                    if (columnName === "action") {
                        return "id";
                    }
                    return columnName;
                }}
                columns={[
                    {
                        id: "id",
                        name: "ID",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "deviceId",
                        name: "Device Id",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "scheduleId",
                        name: "Schedule Id",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "transmissionUuid",
                        name: "Transmission UUID",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "messageUuid",
                        name: "Message UUID",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "status",
                        name: "Status",
                        type: "text",
                        hasFilter: true,
                        width: "100px",
                    },
                    {
                        id: "success",
                        name: "Success",
                        type: "bool",
                        hasFilter: true,
                    },
                    {
                        id: "transmittedAt",
                        name: "Transmitted at",
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
                        type: "action",
                        hasFilter: false,
                        width: "100px",
                    },
                ]}
                filters={{
                    id,
                    deviceId,
                    messageUuid,
                    transmissionUuid,
                    status,
                    success,
                    transmittedAt,
                }}
                updateFilters={(key, value) => {
                    switch (key) {
                        case "id":
                            return setId(value);
                        case "deviceId":
                            return setDeviceId(value);
                        case "transmissionUuid":
                            return setTransmissionUuid(value);
                        case "messageUuid":
                            return setMessageUuid(value);
                        case "status":
                            return setStatus(value);
                        case "success":
                            return setSuccess(value);
                        case "transmittedAt":
                            return setTransmittedAt(value);
                        default:
                            return null;
                    }
                }}
            />
        </Page>
    );
};

export default Transmissions;
