import React, { memo } from "react";
import { Link } from "react-router-dom";

import { Button, KIND } from "baseui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";

import { PaginatedTable, Page } from "../Universal";
import OopCore from "../../OopCore";

const Schedules = memo(props => {
    return (
        <Page
            title="Schedules | Settings | Open Interop"
            heading="Schedules"
            actions={
                <Button
                    $as={Link}
                    to={`${props.location.pathname}/new`}
                    kind={KIND.minimal}
                    aria-label="Create new Schedule"
                    endEnhancer={() => <FontAwesomeIcon icon={faPlus} />}
                >
                    New
                </Button>
            }
        >
            <PaginatedTable
                getData={(pagination) => OopCore.getSchedules(pagination)}
                mapFunction={(columnName, content) => {
                    if (columnName === "action") {
                        return (
                            <>
                                <Button
                                    kind={KIND.tertiary}
                                    $as={Link}
                                    to={`${props.location.pathname}/${content}`}
                                    aria-label="Edit Schedule"
                                >
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                    />
                                </Button>
                            </>
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
                        width: "50px",
                    },
                    {
                        id: "name",
                        name: "Name",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "monthOfYear",
                        name: "Month of Year",
                        type: "text",
                        hasFilter: false,
                    },
                    {
                        id: "dayOfMonth",
                        name: "Day of Month",
                        type: "text",
                        hasFilter: false,
                    },
                    {
                        id: "dayOfWeek",
                        name: "Day of Week",
                        type: "text",
                        hasFilter: false,
                    },
                    {
                        id: "hour",
                        name: "Hour",
                        type: "text",
                        hasFilter: false,
                    },
                    {
                        id: "minute",
                        name: "Minute",
                        type: "text",
                        hasFilter: false,
                    },
                    {
                        id: "action",
                        name: "",
                        type: "action",
                        hasFilter: false,
                        width: "50px",
                    },
                ]}
            />
        </Page>
    );
});

export { Schedules };
