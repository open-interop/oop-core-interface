import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQueryParam, NumberParam, StringParam } from "use-query-params";

import { Button, KIND } from "baseui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";

import { DataProvider, Pagination, Table, Page } from "../Universal";
import OopCore from "../../OopCore";

const Users = props => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useQueryParam("page", NumberParam);
    const [pageSize, setPageSize] = useQueryParam("pageSize", NumberParam);
    const [id, setId] = useQueryParam("id", StringParam);
    const [email, setEmail] = useQueryParam("email", StringParam);

    // reset page number when the search query is changed
    useEffect(() => {
        setPage(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize]);

    return (
        <Page
            title="Users | Settings | Open Interop"
            heading="Users"
            actions={
                    <Button
                        $as={Link}
                        to={`/users/new`}
                        kind={KIND.minimal}
                        aria-label="Create new user"
                        endEnhancer={() => <FontAwesomeIcon icon={faPlus} />}
                    >
                        New
                    </Button>
            }
        >
            <DataProvider
                getData={() =>
                    OopCore.getUsers({ page, pageSize, id, email }).then(
                        response => {
                            setUsers(response);
                            return response;
                        },
                    )
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
                                            <Button
                                                kind={KIND.tertiary}
                                                $as={Link}
                                                to={`/users/${content}`}
                                                aria-label="Edit user"
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
                                    id: "email",
                                    name: "Email",
                                    type: "text",
                                    hasFilter: true,
                                },
                                { id: "createdAt", name: "Created At" },
                                { id: "updatedAt", name: "Updated At" },
                                { id: "action", name: "", width: "50px" },
                            ]}
                            columnContent={columnName => {
                                if (columnName === "action") {
                                    return "id";
                                }
                                return columnName;
                            }}
                            filters={{ id, email }}
                            updateFilters={(key, value) => {
                                switch (key) {
                                    case "id":
                                        return setId(value);
                                    case "email":
                                        return setEmail(value);
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
                            totalRecords={users.totalRecords}
                            numberOfPages={users.numberOfPages}
                            currentPage={page || 1}
                        />
                    </>
                )}
            />
        </Page>
    );
};

export { Users };
