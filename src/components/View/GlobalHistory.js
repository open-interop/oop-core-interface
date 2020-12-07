import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { useQueryParam, StringParam, NumberParam } from "use-query-params";

import { Button, KIND } from "baseui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl } from "@fortawesome/free-solid-svg-icons";

import { DataProvider, PaginatedTable, Page, DatetimeTooltip } from "../Universal";
import OopCore from "../../OopCore";

const GlobalHistory = props => {
    useEffect(() => {
        document.title = "Global History | Open Interop";
    }, []);

    const [id, setId] = useQueryParam("id", NumberParam);
    const [auditableId, setAuditableId] = useQueryParam("auditableId", NumberParam);
    const [auditableType, setAuditableType] = useQueryParam("auditableType", StringParam);
    const [version, setVersion] = useQueryParam("version", NumberParam);
    const [userId, setUserId] = useQueryParam("userId", NumberParam);
    const [action, setAction] = useQueryParam("action", StringParam);

    return (
        <Page
            heading={"Global History"}
        >
            <PaginatedTable
                getData={(pagination) => {
                    return OopCore.getGlobalHistory(pagination);
                }}
                mapFunction={(columnName, content) => {
                    if (columnName === "viewAll") {
                        return (
                            <Button
                                kind={KIND.tertiary}
                                $as={Link}
                                to={`/audit-logs/${content}`}
                                aria-label="View audit log details"
                            >
                                <FontAwesomeIcon icon={faListUl} />
                            </Button>
                        );
                    }

                    if (columnName === "auditedChanges") {
                        return Object.keys(content).length;
                    }

                    if (columnName === "createdAt") {
                        return (
                            <DatetimeTooltip time={content}></DatetimeTooltip>
                        );
                    }
                    return content;
                }}
                columnContent={columnName => {
                    if (columnName === "viewAll") {
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
                        id: "auditableId",
                        name: "Component Id",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "auditableType",
                        name: "Component Type",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "version",
                        name: "Component Version",
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
                        id: "action",
                        name: "Action",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "auditedChanges",
                        name: "Number of Changes",
                        type: "number",
                    },
                    {
                        id: "createdAt",
                        name: "Created At",
                        type: "text",
                    },
                    {
                        id: "viewAll",
                        name: "",
                        type: "action",
                        width: "100px",
                    },
                ]}
                filters={{
                    id,
                    auditableId,
                    auditableType,
                    version,
                    userId,
                    action,
                }}
                updateFilters={(key, value) => {
                    switch (key) {
                        case "id":
                            return setId(value);
                        case "auditableId":
                            return setAuditableId(value);
                        case "auditableType":
                            return setAuditableType(value);
                        case "version":
                            return setVersion(value);
                        case "userId":
                            return setUserId(value);
                        case "action":
                            return setAction(value);
                        default:
                            return null;
                    }
                }}
            />
        </Page>
    );
};

export default GlobalHistory;
