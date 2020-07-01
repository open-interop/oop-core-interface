import React, { memo } from "react";
import { Link } from "react-router-dom";

import { Button, KIND } from "baseui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";

import { PaginatedTable, Page } from "../Universal";
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
                getData={(page, pageSize, filters) => OopCore.getUsers({ page, pageSize, ...filters })}
                mapFunction={(columnName, content) => {
                    if (columnName === "action") {
                        return (
                            <>
                                <Button
                                    kind={KIND.tertiary}
                                    $as={Link}
                                    to={`/users/${content}`}
                                    aria-label="Edit user"
                                >
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                    />
                                </Button>
                            </>
                        );
                    } else {
                        return content;
                    }
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
                    },
                    { id: "createdAt", name: "Created At" },
                    { id: "updatedAt", name: "Updated At" },
                    { id: "action", name: "", width: "50px" },
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

export { Users };
