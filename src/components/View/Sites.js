import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryParam, NumberParam } from "use-query-params";
import { Button } from "baseui/button";
import Show from "baseui/icon/show";
import { DataProvider, Pagination, Table } from "../Universal";
import OopCore from "../../OopCore";

const Sites = props => {
    const [sites, setSites] = useState([]);
    const [page, setPage] = useQueryParam("page", NumberParam);
    const [pageSize, setPageSize] = useQueryParam("pageSize", NumberParam);

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
                    OopCore.getSites({ page, pageSize }).then(response => {
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
                                { id: "id", name: "ID" },
                                { id: "name", name: "Name" },
                                { id: "action", name: "Action" },
                            ]}
                            columnContent={columnName => {
                                if (columnName === "action") {
                                    return "id";
                                }
                                return columnName;
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
