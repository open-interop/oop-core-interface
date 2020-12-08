import React, { useState, memo } from "react";

import { Link } from "react-router-dom";
import { Button, KIND } from "baseui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faExternalLinkAlt,
    faCheck,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";

import {
    AccordionWithCaption,
    IconSpinner,
    PaginatedTable,
} from "../Universal";

import OopCore from "../../OopCore";

const getData = (pagination) => {
    return OopCore.getSchedules({
        //scheduleGroupId: updatedTempr.scheduleGroupId,
        ...pagination,
    });
};

const ScheduleAssociator = memo(props => {
    const [scheduleTemprLoading, setScheduleTemprLoading] = useState(false);

    const selected = {};
    // eslint-disable-next-line
    for (const scheduleTempr of props.selected) {
        selected[scheduleTempr.scheduleId] = scheduleTempr;
    }

    return (
        <AccordionWithCaption
            title="Schedule Associations "
            subtitle="Select schedules to associate with this tempr"
            error={props.error}
            startOpen={props.startOpen || false}
        >
            <PaginatedTable
                prefix="schedule-"
                getData={getData}
                rowClassName={row =>
                    `schedule-tempr${row.selected ? " selected" : ""}`
                }
                mapFunction={(columnName, content, row) => {
                    if (columnName === "action") {
                        return (
                            <>
                                <Button
                                    kind={KIND.minimal}
                                    $as={Link}
                                    target="_blank"
                                    to={"/schedules/" + content}
                                >
                                    <FontAwesomeIcon
                                        icon={faExternalLinkAlt}
                                    />
                                </Button>
                            </>
                        );
                    }

                    if (columnName === "selected") {
                        if (scheduleTemprLoading === row.id) {
                            return <IconSpinner />;
                        }
                        return selected[row.id] ? (
                            <FontAwesomeIcon icon={faCheck} />
                        ) : (
                            <FontAwesomeIcon icon={faTimes} />
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
                        id: "selected",
                        name: "",
                        type: "bool",
                        hasFilter: true,
                        width: "20px",
                    },
                    {
                        id: "id",
                        name: "Id",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "name",
                        name: "Name",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "action",
                        name: "",
                        type: "action",
                        hasFilter: false,
                        width: "30px",
                    },
                ]}
                trueText="Selected"
                falseText="Not selected"
                onRowClick={async (schedule, column) => {
                    if (column !== "action" && !scheduleTemprLoading) {
                        setScheduleTemprLoading(schedule.id);

                        if (selected[schedule.id]) {
                            await props.onDeselect(schedule, selected[schedule.id]);
                        } else {
                            await props.onSelect(schedule);
                        }

                        setScheduleTemprLoading(false);
                    }
                }}
            />
        </AccordionWithCaption>
    );
});

export default ScheduleAssociator;
