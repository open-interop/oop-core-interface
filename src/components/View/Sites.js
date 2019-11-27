import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQueryParam, NumberParam, StringParam } from "use-query-params";
import { Button, KIND } from "baseui/button";
import { DataProvider, Pagination, Table } from "../Universal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import OopCore from "../../OopCore";

const Sites = props => {
    useEffect(() => {
        document.title = "Sites | Settings | Open Interop";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [sites, setSites] = useState([]);
    const [page, setPage] = useQueryParam("page", NumberParam);
    const [pageSize, setPageSize] = useQueryParam("pageSize", NumberParam);
    const [id, setId] = useQueryParam("id", StringParam);
    const [name, setName] = useQueryParam("name", StringParam);
    const [fullName, setFullName] = useQueryParam("fullName", StringParam);

    return (
        <div className="content-wrapper">
            <div className="space-between">
                <h2>Sites</h2>
                <Button
                    $as={Link}
                    to={`/sites/new`}
                    kind={KIND.minimal}
                    aria-label="Create new site"
                    endEnhancer={() => <FontAwesomeIcon icon={faPlus} />}
                >
                    New
                </Button>
            </div>
            <DataProvider
                getData={() =>
                    OopCore.getSites({
                        page,
                        pageSize,
                        id,
                        name,
                        fullName,
                    }).then(response => {
                        setSites(response);
                        return response;
                    })
                }
                renderKey={props.location.search}
                renderData={() => (
                    <>
                        <Table
                            data={sites.data}
                            mapFunction={(columnName, content) => {
                                if (columnName === "action") {
                                    return (
                                        <>
                                            <Button
                                                kind={KIND.tertiary}
                                                $as={Link}
                                                to={`/sites/${content}`}
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
                                    id: "name",
                                    name: "Name",
                                    type: "text",
                                    hasFilter: true,
                                },
                                {
                                    id: "fullName",
                                    name: "Full Name",
                                    type: "text",
                                    hasFilter: true,
                                },
                                {
                                    id: "action",
                                    name: "",
                                    width: "100px",
                                },
                            ]}
                            columnContent={columnName => {
                                if (columnName === "action") {
                                    return "id";
                                }
                                return columnName;
                            }}
                            filters={{ id, name, fullName }}
                            updateFilters={(key, value) => {
                                switch (key) {
                                    case "id":
                                        return setId(value);
                                    case "name":
                                        return setName(value);
                                    case "fullName":
                                        return setFullName(value);
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
                            totalRecords={sites.totalRecords}
                            numberOfPages={sites.numberOfPages}
                            currentPage={page || 1}
                        />
                    </>
                )}
            />
        </div>
    );
};

export { Sites };
