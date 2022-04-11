import React, { memo } from "react";
import { Link } from "react-router-dom";

import { Button, KIND } from "baseui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPlus, faEdit, faChartPie, faListUl, faHistory } from "@fortawesome/free-solid-svg-icons";

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
                getData={pagination => OopCore.getSchedules(pagination)}
                mapFunction={(columnName, content) => {
                    if (columnName === "action") {
                        return (
                            <>
                                <Button
                                    $as={Link}
                                    kind={KIND.minimal}
                                    to={`/schedules/${content}`}
                                    aria-label="View schedule dashboard"
                                >
                                    <FontAwesomeIcon icon={faChartPie} />
                                </Button>
                                <Button
                                    $as={Link}
                                    kind={KIND.minimal}
                                    to={{
                                        pathname: `/schedules/${content}/edit`,
                                        prevPath: props.location,
                                    }}
                                    aria-label="Edit schedule"
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button
                                    $as={Link}
                                    kind={KIND.minimal}
                                    to={{
                                        pathname: `/schedules/${content}/audit-logs`,
                                        state: { from: `/schedules` },
                                    }}
                                    aria-label="View schedule history"
                                >
                                    <FontAwesomeIcon icon={faHistory} />
                                </Button>
                                <Button
                                    $as={Link}
                                    kind={KIND.minimal}
                                    to={`/messages?filter=originType-Schedule_originId-${content}`}
                                    aria-label="View schedule messages"
                                >
                                    <FontAwesomeIcon icon={faListUl} />
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
                        name: "ID",
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
                        width: "200px",
                    },
                ]}
            />
        </Page>
    );
});

export default Schedules;
