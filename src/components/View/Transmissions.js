import React, { useEffect, useState } from "react";
import moment from "moment";

import { Link } from "react-router-dom";
import { useQueryParam, StringParam } from "use-query-params";

import { Button, KIND } from "baseui/button";
import { StatefulTooltip } from "baseui/tooltip";

import parseISO from "date-fns/parseISO";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";

import { DataProvider, PaginatedTable, Page } from "../Universal";
import OopCore from "../../OopCore";

const Transmissions = props => {
    useEffect(() => {
        document.title = "Transmissions | Open Interop";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [device, setDevice] = useState({});
    const [id, setId] = useQueryParam("id", StringParam);
    const [transmissionUuid, setTransmissionUuid] = useQueryParam(
        "transmissionUuid",
        StringParam,
    );
    const [messageUuid, setMessageUuid] = useQueryParam(
        "messageUuid",
        StringParam,
    );
    const [status, setStatus] = useQueryParam("status", StringParam);
    const [success, setSuccess] = useQueryParam("success", StringParam);

    const formatISODate = date => {
        const d = new Date();
        const dtf = Intl.DateTimeFormat(undefined, {timeZoneName: 'short'});
        const timezone = " " + dtf.formatToParts(d).find((part) => part.type == 'timeZoneName').value;

        if (date) {
            const date_obj = parseISO(date);
            return moment(date_obj).format('YYYY-MM-DD HH:mm:ss') + timezone;
        } else {
            return null;
        }
    };

    const getData = () => {
        return OopCore.getDevice(props.match.params.deviceId).then(setDevice);
    };

    const deviceDashboardPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    return (
        <Page
            heading={
                `Transmissions ${
                    device.name
                        ? "- " + device.name
                        : ""}`
            }
            backlink={deviceDashboardPath}
        >
            <>
                <DataProvider
                    getData={() => {
                        return getData();
                    }}
                    renderData={() => (
                            <PaginatedTable
                                getData={(page, pageSize, filters) => {
                                    return OopCore.getTransmissions(props.match.params.deviceId, filters);
                                }}
                                mapFunction={(columnName, content) => {
                                    if (columnName === "action") {
                                        return (
                                            <Button
                                                kind={KIND.tertiary}
                                                $as={Link}
                                                to={`${props.location.pathname}/${content}`}
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

                                    if (columnName === "transmittedAt") {
                                        return (
                                            <StatefulTooltip
                                                accessibilityType={"tooltip"}
                                                content={
                                                    content || ""
                                                }
                                                showArrow={true}
                                                placement="right"
                                                overrides={{
                                                    Body: {
                                                        style: ({ $theme }) => ({
                                                            backgroundColor:
                                                                $theme.colors.black,
                                                            borderTopLeftRadius:
                                                                $theme.borders
                                                                    .radius200,
                                                            borderTopRightRadius:
                                                                $theme.borders
                                                                    .radius200,
                                                            borderBottomRightRadius:
                                                                $theme.borders
                                                                    .radius200,
                                                            borderBottomLeftRadius:
                                                                $theme.borders
                                                                    .radius200,
                                                        }),
                                                    },
                                                    Inner: {
                                                        style: ({ $theme }) => ({
                                                            backgroundColor:
                                                                $theme.colors.black,
                                                            borderTopLeftRadius:
                                                                $theme.borders
                                                                    .radius200,
                                                            borderTopRightRadius:
                                                                $theme.borders
                                                                    .radius200,
                                                            borderBottomRightRadius:
                                                                $theme.borders
                                                                    .radius200,
                                                            borderBottomLeftRadius:
                                                                $theme.borders
                                                                    .radius200,
                                                            color:
                                                                $theme.colors.white,
                                                            fontSize: "14px",
                                                        }),
                                                    },
                                                }}
                                            >
                                                {formatISODate(
                                                    content,
                                                ) || "No data available"}
                                            </StatefulTooltip>
                                            );
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
                                        name: "Id",
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
                                        type: "text",
                                        hasFilter: false,
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
                                    messageUuid,
                                    transmissionUuid,
                                    status,
                                    success,
                                }}
                                updateFilters={(key, value) => {
                                    switch (key) {
                                        case "id":
                                            return setId(value);
                                        case "transmissionUuid":
                                            return setTransmissionUuid(value);
                                        case "messageUuid":
                                            return setMessageUuid(value);
                                        case "status":
                                            return setStatus(value);
                                        case "success":
                                            return setSuccess(value);
                                        default:
                                            return null;
                                    }
                                }}
                            />
                    )}
                    renderKey={props.location.search}
                />
            </>
        </Page>
    );
};

export { Transmissions };
