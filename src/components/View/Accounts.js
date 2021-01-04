import React, { memo } from "react";
import { Link } from "react-router-dom";

import { Button, KIND } from "baseui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faUserCircle, faHistory } from "@fortawesome/free-solid-svg-icons";

import { PaginatedTable, Page, DatetimeTooltip } from "../Universal";
import OopCore from "../../OopCore";

const Accounts = memo(props => {
    return (
        <Page
            title="Accounts | Settings | Open Interop"
            heading="Accounts"
            actions={
                    <Button
                        $as={Link}
                        to={`/accounts/new`}
                        kind={KIND.minimal}
                        aria-label="Create new account"
                        endEnhancer={() => <FontAwesomeIcon icon={faPlus} />}
                    >
                        New
                    </Button>
            }
        >
            <PaginatedTable
                getData={(pagination) => OopCore.getAccounts(pagination)}
                mapFunction={(columnName, content) => {
                    if (columnName === "action") {
                        return (
                            <>
                                <Button
                                    kind={KIND.tertiary}
                                    $as={Link}
                                    to={`/accounts/${content}`}
                                    aria-label="Edit account"
                                >
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                    />
                                </Button>
                                <Button
                                    kind={KIND.tertiary}
                                    $as={Link}
                                    to={{pathname: `/accounts/${content}/audit-logs`, state: {from: `/accounts`}}}
                                    aria-label="View account history"
                                >
                                    <FontAwesomeIcon
                                        icon={faHistory}
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
                        id: "id",
                        name: "ID",
                        type: "text",
                        hasFilter: true,
                        width: "50px",
                    },
                    {
                        id: "hostname",
                        name: "Hostname",
                        type: "text",
                        hasFilter: true,
                    },
                    { id: "createdAt", name: "Created At" },
                    { id: "action", name: "", width: "100px" },
                ]}
                columnContent={columnName => {
                    if (columnName === "action") {
                        return "id";
                    }
                    return columnName;
                }}
            />
        </Page>
    );
});

export default Accounts;
