import React, { useState } from "react";

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
    BaseuiSpinner,
    DataProvider,
    IconSpinner,
    Pagination,
    Table,
} from "../Universal";

import OopCore from "../../OopCore";

const ScheduleAssociator = props => {
    const [schedulesPage, setSchedulesPage] = useState(1);
    const [schedulesPageSize, setSchedulesPageSize] = useState(10);
    const [scheduleFilterId, setScheduleFilterId] = useState("");
    const [scheduleFilterName, setScheduleFilterName] = useState("");
    const [scheduleFilterSelected, setScheduleFilterSelected] = useState("");
    const [scheduleTemprLoading, setScheduleTemprLoading] = useState(false);

    const selected = {};

    for (const scheduleTempr of props.selected) {
        selected[scheduleTempr.scheduleId] = scheduleTempr;
    }

    console.log(selected);

    const renderScheduleAssociations = schedules => {
        return (
            <>
                <Table
                    data={schedules.data}
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
                    filters={{
                        id: scheduleFilterId,
                        name: scheduleFilterName,
                        selected: scheduleFilterSelected,
                    }}
                    updateFilters={(key, value) => {
                        switch (key) {
                            case "id":
                                return setScheduleFilterId(value);
                            case "name":
                                return setScheduleFilterName(value);
                            case "selected":
                                if (value === null) {
                                    return setScheduleFilterSelected("");
                                }
                                return setScheduleFilterSelected(value);
                            default:
                                return null;
                        }
                    }}
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
                <Pagination
                    updatePageSize={pageSize => {
                        setSchedulesPageSize(pageSize);
                    }}
                    currentPageSize={schedulesPageSize}
                    updatePageNumber={pageNumber => setSchedulesPage(pageNumber)}
                    totalRecords={schedules.totalRecords}
                    numberOfPages={schedules.numberOfPages}
                    currentPage={schedulesPage || 1}
                />
            </>
        );
    };

    return <AccordionWithCaption
        title="Schedule Associations "
        subtitle="Select schedules to associate with this tempr"
        error={props.error}
        startOpen
    >
    <DataProvider
        getData={() => {
            return OopCore.getSchedules({
                //scheduleGroupId: updatedTempr.scheduleGroupId,
                pageSize: schedulesPageSize,
                page: schedulesPage,
                id: scheduleFilterId,
                name: scheduleFilterName,
            });
        }}
        renderKey={
            schedulesPage +
                schedulesPageSize +
                scheduleFilterId +
                scheduleFilterName +
                scheduleFilterSelected
        }
        renderData={renderScheduleAssociations}
    />
    </AccordionWithCaption>
    ;
};

export default ScheduleAssociator;
