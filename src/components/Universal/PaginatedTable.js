import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { useQueryParam, NumberParam, ObjectParam } from "use-query-params";
import { Pagination, PaginationMobile, Table } from ".";
import { Block } from 'baseui/block';

const PaginatedTable = withRouter(props => {
    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [page, setPage] = useQueryParam(`${props.prefix || ""}page`, NumberParam);
    const [pageSize, setPageSize] = useQueryParam(`${props.prefix || ""}pageSize`, NumberParam);
    const [filters, setFilters] = useQueryParam(`${props.prefix || ""}filter`, ObjectParam);
    var getData = props.getData;

    function formatFilters(filters = {}){
        const formattedFilters = {...filters}
        Object.entries(formattedFilters).map(([key, value]) => {
            if(props.columns.find(c => c.id === key).type === "datetime" && value){
                const splitString = value.split("#");
                formattedFilters[key] = {gt: splitString[0] === "gt", val: splitString[1].replaceAll("/", "-")}
            }
        })
        return formattedFilters;
    }

    useEffect(() => {
        setLoading(true);
        const args = {
            page: {
                number: page,
                size: pageSize,
            },
            filter: formatFilters(filters),
        };
        getData(args)
            .then(d => {
                setData(d);
                setLoading(false);
            });
    }, [page, pageSize, filters]);

    return (
        <>
            <Block display={['none', 'none', 'none', 'block']}>
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
            </Block>
            <Block display={['none', 'none', 'block', 'none']}>
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
            </Block>
            <Block display={['block', 'block', 'none']}>
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
            </Block>
        </>
    );
});

export { PaginatedTable };
