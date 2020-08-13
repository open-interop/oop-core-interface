import React, { memo } from "react";
import { Link } from "react-router-dom";

import { Button, KIND } from "baseui/button";
import { StatefulTooltip } from "baseui/tooltip";

import parseISO from "date-fns/parseISO";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";

import { PaginatedTable, Page } from "../Universal";
import OopCore from "../../OopCore";

import moment from "moment";

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
                    }
                    if (columnName === "createdAt" || columnName === "updatedAt") {
                        return (
                            <StatefulTooltip
                                accessibilityType={"tooltip"}
                                content={
                                    content || ""
                                }
                                showArrow={true}
                                placement={"right"}
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
