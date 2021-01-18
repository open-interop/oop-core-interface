import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { useQueryParam, NumberParam, ObjectParam } from "use-query-params";
import { Pagination, PaginationMobile, Table } from ".";
import { useWindowDimensions } from "../../Utilities";

const PaginatedTable = withRouter(props => {
    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [page, setPage] = useQueryParam(`${props.prefix || ""}page`, NumberParam);
    const [pageSize, setPageSize] = useQueryParam(`${props.prefix || ""}pageSize`, NumberParam);
    const [filters, setFilters] = useQueryParam(`${props.prefix || ""}filter`, ObjectParam);
    var getData = props.getData;

    useEffect(() => {
        setLoading(true);
        const args = {
            page: {
                number: page,
                size: pageSize,
            },
            filter: { ...(filters || {}) },
        };
        getData(args)
            .then(d => {
                setData(d);
                setLoading(false);
            });
    }, [page, pageSize, filters, getData]);

    // eslint-disable-next-line no-unused-vars
    const { height, width } = useWindowDimensions();

    return (
        <>
            {
                width >= 1100 ? (
                    <>
                        <Table
                            {...props}
                            loading={loading}
                            data={data && data.data}
                            filters={filters}
                            mobile={false}
                            updateFilters={(colId, value) => {
                                if (filters) {
                                    if (value === "") {
                                        delete filters[colId];
                                    } else {
                                        filters[colId] = value;
                                    }
                                    setFilters(filters);
                                } else {
                                    setFilters({ [colId]: value });
                                }
                            }}
                        />
                        <Pagination
                            updatePageSize={pageSize => {
                                setPageSize(pageSize);
                            }}
                            currentPageSize={pageSize}
                            updatePageNumber={pageNumber => setPage(pageNumber)}
                            totalRecords={data ? data.totalRecords : "-"}
                            numberOfPages={data ? data.numberOfPages : "-"}
                            currentPage={page || 1}
                        />
                    </>
                ) : width >= 650 ? (
                    <>
                        <Table
                            {...props}
                            loading={loading}
                            data={data && data.data}
                            filters={filters}
                            mobile={false}
                            updateFilters={(colId, value) => {
                                if (filters) {
                                    if (value === "") {
                                        delete filters[colId];
                                    } else {
                                        filters[colId] = value;
                                    }
                                    setFilters(filters);
                                } else {
                                    setFilters({ [colId]: value });
                                }
                            }}
                        />
                        <PaginationMobile
                            updatePageSize={pageSize => {
                                setPageSize(pageSize);
                            }}
                            currentPageSize={pageSize}
                            updatePageNumber={pageNumber => setPage(pageNumber)}
                            totalRecords={data ? data.totalRecords : "-"}
                            numberOfPages={data ? data.numberOfPages : "-"}
                            currentPage={page || 1}
                        />
                    </>
                ) : (
                    <>
                        <Table
                            {...props}
                            loading={loading}
                            data={data && data.data}
                            filters={filters}
                            mobile={true}
                            updateFilters={(colId, value) => {
                                if (filters) {
                                    if (value === "") {
                                        delete filters[colId];
                                    } else {
                                        filters[colId] = value;
                                    }
                                    setFilters(filters);
                                } else {
                                    setFilters({ [colId]: value });
                                }
                            }}
                        />
                        <PaginationMobile
                            updatePageSize={pageSize => {
                                setPageSize(pageSize);
                            }}
                            currentPageSize={pageSize}
                            updatePageNumber={pageNumber => setPage(pageNumber)}
                            totalRecords={data ? data.totalRecords : "-"}
                            numberOfPages={data ? data.numberOfPages : "-"}
                            currentPage={page || 1}
                        />
                    </>
                )
            }
        </>
    );
});

export { PaginatedTable };
