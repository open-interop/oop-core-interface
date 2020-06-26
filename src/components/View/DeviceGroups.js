import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, KIND } from "baseui/button";
import { Heading, HeadingLevel } from "baseui/heading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useQueryParam, NumberParam, StringParam } from "use-query-params";
import { DataProvider, Pagination, Table } from "../Universal";
import OopCore from "../../OopCore";

const DeviceGroups = props => {
    const [deviceGroups, setDeviceGroups] = useState([]);
    const [page, setPage] = useQueryParam("page", NumberParam);
    const [pageSize, setPageSize] = useQueryParam("pageSize", NumberParam);
    const [id, setId] = useQueryParam("id", StringParam);
    const [name, setName] = useQueryParam("name", StringParam);

    // reset page number when the search query is changed
    useEffect(() => {
        setPage(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, id]);

    useEffect(() => {
        document.title = "Device Groups | Settings | Open Interop";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="content-wrapper">
            <HeadingLevel>
                <div className="space-between">
                    <Heading>Device Groups</Heading>
                    <Button
                        $as={Link}
                        to={`/device-groups/new`}
                        kind={KIND.minimal}
                        aria-label="Create new tempr"
                        endEnhancer={() => <FontAwesomeIcon icon={faPlus} />}
                    >
                        New
                    </Button>
                </div>

                <DataProvider
                    getData={() => {
                        return OopCore.getDeviceGroups({
                            page,
                            pageSize,
                            id,
                            name,
                        }).then(response => {
                            setDeviceGroups(response);
                            return response;
                        });
                    }}
                    renderKey={props.location.search}
                    renderData={() => (
                        <>
                            <Table
                                data={deviceGroups.data}
                                mapFunction={(columnName, content) => {
                                    if (columnName === "action") {
                                        return (
                                            <>
                                                <Button
                                                    kind={KIND.tertiary}
                                                    $as={Link}
                                                    to={`/device-groups/${content}`}
                                                    aria-label="Edit device group"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                    />
                                                </Button>

                                                <Button
                                                    $as={Link}
                                                    kind={KIND.tertiary}
                                                    to={`devices?deviceGroupId=${content}`}
                                                    aria-label="View devices for this group"
                                                >
                                                    Devices
                                                </Button>
                                                <Button
                                                    $as={Link}
                                                    kind={KIND.tertiary}
                                                    to={`/temprs?deviceGroupId=${content}`}
                                                    aria-label="View temprs for this group"
                                                >
                                                    Temprs
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
                                        id: "action",
                                        name: "",
                                        type: "action",
                                        hasFilter: false,
                                        width: "250px",
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
                                totalRecords={deviceGroups.totalRecords}
                                numberOfPages={deviceGroups.numberOfPages}
                                currentPage={page || 1}
                            />
                        </>
                    )}
                />
            </HeadingLevel>
        </div>
    );
};

export { DeviceGroups };
