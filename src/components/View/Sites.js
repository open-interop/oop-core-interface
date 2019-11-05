import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryParam, NumberParam, StringParam } from "use-query-params";
import { Button } from "baseui/button";
import Show from "baseui/icon/show";
import { DataProvider, Pagination, Table } from "../Universal";
import OopCore from "../../OopCore";

const Sites = props => {
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
                <Button $as={Link} to={`/sites/new`}>
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
                                            <Link to={`/sites/${content}`}>
                                                <Show />
                                            </Link>
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
                                { id: "action", name: "Action" },
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
