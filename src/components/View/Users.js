import React, { memo } from "react";
import { Link } from "react-router-dom";

import { Button, KIND } from "baseui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faUserCircle, faHistory } from "@fortawesome/free-solid-svg-icons";

import { PaginatedTable, Page, DatetimeTooltip } from "../Universal";
import OopCore from "../../OopCore";

const Users = memo(props => {
    return (
        <Page
            title="Users | Settings | Open Interop"
            heading="Users"
            actions={
                <Button
                    $as={Link}
                    to={`/users/new`}
                    kind={KIND.minimal}
                    aria-label="Create new user"
                    endEnhancer={() => <FontAwesomeIcon icon={faPlus} />}
                >
                    New
                </Button>
            }
        >
            <PaginatedTable
                getData={pagination => OopCore.getUsers(pagination)}
                mapFunction={(columnName, content) => {
                    if (columnName === "action") {
                        return (
                            <>
                                <Button
                                    kind={KIND.tertiary}
                                    $as={Link}
                                    to={`/users/${content}`}
                                    aria-label="User dashboard"
                                >
                                    <FontAwesomeIcon icon={faUserCircle} />
                                </Button>
                                <Button
                                    kind={KIND.tertiary}
                                    $as={Link}
                                    to={`/users/${content}/edit`}
                                    aria-label="Edit user"
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button
                                    kind={KIND.tertiary}
                                    $as={Link}
                                    to={{
                                        pathname: `/users/${content}/audit-logs`,
                                        state: { from: `/users` },
                                    }}
                                    aria-label="View user history"
                                >
                                    <FontAwesomeIcon icon={faHistory} />
                                </Button>
                            </>
                        );
                    }
                    if (columnName === "createdAt") {
                        return <DatetimeTooltip time={content}></DatetimeTooltip>;
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
                        id: "email",
                        name: "Email",
                        type: "text",
                        hasFilter: true,
                        width: "250px",
                    },
                    {
                        id: "firstName",
                        name: "First Names",
                        type: "text",
                        hasFilter: false,
                    },
                    {
                        id: "lastName",
                        name: "Last Name",
                        type: "text",
                        hasFilter: false,
                    },
                    { id: "createdAt", name: "Created At" },
                    { id: "action", name: "", width: "150px" },
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

export default Users;
