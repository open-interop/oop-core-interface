import React, { useState } from "react";
import { Link } from "react-router-dom";
import Show from "baseui/icon/show";
import { DataProvider, Pagination, Table } from "../Universal";
import { useQueryParam, NumberParam } from "use-query-params";
import OopCore from "../../OopCore";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useQueryParam("page", NumberParam);
    const [pageSize, setPageSize] = useQueryParam("pageSize", NumberParam);

    return (
        <DataProvider
            getData={() =>
                OopCore.getUsers().then(response => {
                    setUsers(response);
                    return response;
                })
            }
            renderData={() => (
                <div className="content-wrapper">
                    <h2>Users</h2>
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
                </div>
            )}
        />
    );
};

export { Users };
