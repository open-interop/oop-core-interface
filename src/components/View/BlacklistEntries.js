import React, { memo } from "react";
import { Link } from "react-router-dom";

import { Button, KIND } from "baseui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";

import { PaginatedTable, Page } from "../Universal";
import OopCore from "../../OopCore";

const BlacklistEntries = memo(props => {
    return (
        <Page
            title="Blacklist Entries | Settings | Open Interop"
            heading="Blacklist Entries"
            actions={
                    <Button
                        $as={Link}
                        to={`/blacklist-entry/new`}
                        kind={KIND.minimal}
                        aria-label="Create new Blacklist Entry"
                        endEnhancer={() => <FontAwesomeIcon icon={faPlus} />}
                    >
                        New
                    </Button>
            }
        >
            <PaginatedTable
                getData={(page, pageSize, filters) => OopCore.getBlacklistEntries({ page, pageSize, ...filters })}
                mapFunction={(columnName, content, row) => {
                    if (columnName === "action") {
                        return (
                            <>
                                <Button
                                    kind={KIND.tertiary}
                                    $as={Link}
                                    to={`/blacklist-entries/${content}`}
                                    aria-label="Edit Blacklist Entry"
                                >
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                    />
                                </Button>
                            </>
                        );
                    } else if (columnName === "entry") {
                        const { ipLiteral, ipRange, pathLiteral, pathRegex, headers } = row;
                        const parts = [];

                        if (ipLiteral) {
                            parts.push(`IP = ${ipLiteral}`);
                        }
                        if (ipRange) {
                            parts.push(`IP in ${ipRange}`);
                        }
                        if (pathLiteral) {
                            parts.push(`Path = ${pathLiteral}`);
                        }
                        if (pathRegex) {
                            parts.push(`Path matches ${pathRegex}`);
                        }
                        if (headers) {
                            parts.push(`Headers contain ${Object.entries(headers).map(([k, v]) => `${k}: ${v}`)}`);
                        }

                        return parts.join(" and ");
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
                    { id: "entry", name: "Entry", },
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

export { BlacklistEntries };

