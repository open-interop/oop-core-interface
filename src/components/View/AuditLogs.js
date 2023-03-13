import React, { useState, lazy } from "react";

import { Link } from "react-router-dom";

import { Button, KIND } from "baseui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl } from "@fortawesome/free-solid-svg-icons";

import { Page, PaginatedTable, DatetimeTooltip } from "../Universal";
import { useQueryParam, StringParam, NumberParam } from "use-query-params";
import OopCore from "../../OopCore";

const PageNotFound = lazy(() => import('../View/PageNotFound'));

function typeHeading(string) {
    const capitalized = (string.charAt(0).toUpperCase() + string.slice(1)).replace('-', ' ');
    if (capitalized[capitalized.length - 1] === 's') {
        if (capitalized.slice(capitalized.length - 3) === 'ies') {
            return capitalized.slice(0, -3) + 'y';
        }
        else {
            return capitalized.slice(0, -1);
        }
    } else {
        return capitalized;
    }
}

function formatType(type) {
    return type.replace(/-/g, "_");
}

const AuditLogs = props => {
    const [action, setAction] = useQueryParam("action", StringParam);
    const [version, setVersion] = useQueryParam("version", NumberParam);
    const [userId, setUserId] = useQueryParam("userId", NumberParam);
    const [notFound, setNotFound] = useState(null);

    const previousPath = (props.location.state && props.location.state.from) ? props.location.state.from
        : props.location.pathname.replace('/audit-logs','');

    const componentHeading = typeHeading(props.match.params.componentType);

    const getData = (pagination) => {
        return OopCore.getAuditLogs(
            formatType(props.match.params.componentType),
            props.match.params.componentId,
            pagination
        ).then(history => {
            return history;
        }).catch(e => {
            setNotFound(true);
        });
    };

    if (notFound) {
        return <PageNotFound item="Audit Logs"/>
    }

    return (
        <Page
            title={"Audit Logs | Open Interop"}
            heading={"Audit Logs - " + componentHeading}
            backlink={previousPath}
        >
            <PaginatedTable
                getData={getData}
                mapFunction={(columnName, content) => {
                    if (columnName === "listAll") {
                        return (
                            <Button
                                kind={KIND.tertiary}
                                $as={Link}
                                to={{pathname: `/audit-logs/${content}`, state: { from: props.location.pathname }}}
                                aria-label={`View Audit Log - ${content}`}
                            >
                                <FontAwesomeIcon
                                    icon={faListUl}
                                />
                            </Button>
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
                        id: "id",
                        name: "ID",
                        type: "text",
                    },
                    {
                        id: "action",
                        name: "Action",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "version",
                        name: "Version",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "userId",
                        name: "User ID",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "createdAt",
                        name: "Created at",
                        type: "text",
                    },
                    {
                        id: "listAll",
                        name: "",
                        width: "100px",
                    },
                ]}
                columnContent={columnName => {
                    if (columnName === "listAll") {
                        return "id";
                    }
                    return columnName;
                }}
                filters={{ action, version, userId }}
                updateFilters={(key, value) => {
                    switch (key) {
                        case "action":
                            return setAction(value);
                        case "version":
                            return setVersion(value);
                        case "userId":
                            return setUserId(value);
                        default:
                            return null;
                    }
                }}
            />
        </Page>
    );
};

export default AuditLogs;
