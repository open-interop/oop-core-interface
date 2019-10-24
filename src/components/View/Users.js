import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQueryParam, NumberParam } from "use-query-params";
import { Button } from "baseui/button";
import Show from "baseui/icon/show";
import { DataProvider, Pagination, Table } from "../Universal";
import OopCore from "../../OopCore";

const Users = props => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useQueryParam("page", NumberParam);
    const [pageSize, setPageSize] = useQueryParam("pageSize", NumberParam);

    // reset page number when the search query is changed
    useEffect(() => {
        setPage(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize]);

    return (
        <div className="content-wrapper">
            <div className="space-between">
                <h2>Users</h2>
                <Button $as={Link} to={`/users/new`}>
                    New
                </Button>
            </div>
            <DataProvider
                getData={() =>
                    OopCore.getUsers({ page, pageSize }).then(response => {
                        setUsers(response);
                        return response;
                    })
                }
                renderKey={props.location.search}
                renderData={() => (
                    <>
                        <Table
                            data={users.data}
                            mapFunction={(columnName, content) => {
                                if (columnName === "action") {
                                    return (
                                        <>
                                            <Link to={`/users/${content}`}>
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
                                { id: "email", name: "Email" },
                                { id: "createdAt", name: "Created At" },
                                { id: "updatedAt", name: "Updated At" },
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
                            totalRecords={users.totalRecords}
                            numberOfPages={users.numberOfPages}
                            currentPage={page || 1}
                        />
                    </>
                )}
            />
        </div>
    );
};

export { Users };
