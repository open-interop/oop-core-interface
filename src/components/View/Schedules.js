import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button, KIND } from "baseui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Heading, HeadingLevel } from "baseui/heading";

import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useQueryParam, NumberParam, StringParam } from "use-query-params";

import { DataProvider, Pagination, Table } from "../Universal";
import OopCore from "../../OopCore";

const Schedules = props => {
    useEffect(() => {
        document.title = "Schedules | Settings | Open Interop";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [schedules, setSchedules] = useState([]);
    const [page, setPage] = useQueryParam("page", NumberParam);
    const [pageSize, setPageSize] = useQueryParam("pageSize", NumberParam);
    const [id, setId] = useQueryParam("id", StringParam);
    const [name, setName] = useQueryParam("name", StringParam);

    // reset page number when the search query is changed
    useEffect(() => {
        setPage(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, id, name]);

    const getData = () => {
        return OopCore.getSchedules({
            page,
            pageSize,
            id,
            name,
        });
    };

    return (
        <div className="content-wrapper">
            <HeadingLevel>
                <div className="space-between">
                    <Heading>Schedules</Heading>
                    <Button
                        $as={Link}
                        to={`${props.location.pathname}/new`}
                        kind={KIND.minimal}
                        aria-label="Create new Schedule"
                        endEnhancer={() => <FontAwesomeIcon icon={faPlus} />}
                    >
                        New
                    </Button>
                </div>
                <DataProvider
                    renderKey={props.location.search}
                    getData={() => {
                        return getData().then(response => {
                            setSchedules(response);
                            return response;
                        });
                    }}
                    renderData={() => (
                        <>
                            <Table
                                data={schedules.data}
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
                                filters={{ id, name }}
                                updateFilters={(key, value) => {
                                    switch (key) {
                                        case "id":
                                        return setId(value);
                                    case "name":
                                            return setName(value);
                                    default:
                                            return null;
                                    }
                                }}
                            />
                            <Pagination
                                updatePageSize={pageSize => {
                                    setPageSize(pageSize);
                                }}
                                currentPageSize={pageSize}
                                updatePageNumber={pageNumber => setPage(pageNumber)}
                                totalRecords={schedules.totalRecords}
                                numberOfPages={schedules.numberOfPages}
                                currentPage={page || 1}
                            />
                        </>
                    )}
                />
            </HeadingLevel>
        </div>
    );
};

export { Schedules };
