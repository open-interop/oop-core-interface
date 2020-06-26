import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, KIND } from "baseui/button";
import { Heading, HeadingLevel } from "baseui/heading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useQueryParam, NumberParam, StringParam } from "use-query-params";
import { DataProvider, Pagination, Table } from "../Universal";
import OopCore from "../../OopCore";

const Layers = props => {
    useEffect(() => {
        document.title = "Layers | Settings | Open Interop";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [layers, setLayers] = useState([]);
    const [page, setPage] = useQueryParam("page", NumberParam);
    const [pageSize, setPageSize] = useQueryParam("pageSize", NumberParam);
    const [id, setId] = useQueryParam("id", StringParam);
    const [name, setName] = useQueryParam("name", StringParam);
    const [reference, setReference] = useQueryParam("reference", StringParam);

    // reset page number when the search query is changed
    useEffect(() => {
        setPage(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, id, name, reference]);

    const getData = () => {
        return OopCore.getLayers({
            page,
            pageSize,
            id,
            name,
            reference,
        });
    };

    return (
        <div className="content-wrapper">
            <HeadingLevel>
                <div className="space-between">
                    <Heading>Layers</Heading>
                    <Button
                        $as={Link}
                        to={`${props.location.pathname}/new`}
                        kind={KIND.minimal}
                        aria-label="Create new layer"
                        endEnhancer={() => <FontAwesomeIcon icon={faPlus} />}
                    >
                        New
                    </Button>
                </div>
                <DataProvider
                    renderKey={props.location.search}
                    getData={() => {
                        return getData().then(response => {
                            setLayers(response);
                            return response;
                        });
                    }}
                    renderData={() => (
                        <>
                            <Table
                                data={layers.data}
                                mapFunction={(columnName, content) => {
                                    if (columnName === "action") {
                                        return (
                                            <>
                                                <Button
                                                    kind={KIND.tertiary}
                                                    $as={Link}
                                                    to={`${props.location.pathname}/${content}`}
                                                    aria-label="Edit Layer"
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
                                        id: "reference",
                                        name: "Reference",
                                        type: "text",
                                        hasFilter: true,
                                    },
                                    {
                                        id: "action",
                                        name: "",
                                        type: "action",
                                        hasFilter: false,
                                        width: "50px",
                                    },
                                ]}
                                filters={{ id, name, reference }}
                                updateFilters={(key, value) => {
                                    switch (key) {
                                        case "id":
                                        return setId(value);
                                    case "name":
                                            return setName(value);
                                    case "reference":
                                            return setReference(value);
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
                                totalRecords={layers.totalRecords}
                                numberOfPages={layers.numberOfPages}
                                currentPage={page || 1}
                            />
                        </>
                    )}
                />
            </HeadingLevel>
        </div>
    );
};

export { Layers };

