import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { useQueryParam, NumberParam, ObjectParam } from "use-query-params";
import { Pagination, Table } from ".";
import { Block } from 'baseui/block';

const PaginatedTable = withRouter(props => {
    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [page, setPage] = useQueryParam(`${props.prefix || ""}page`, NumberParam);
    const [pageSize, setPageSize] = useQueryParam(`${props.prefix || ""}pageSize`, NumberParam);
    const [filters, setFilters] = useQueryParam(`${props.prefix || ""}filters`, ObjectParam);

    useEffect(() => {
        setLoading(true);
        props.getData(page, pageSize, filters || {})
            .then(d => {
                setData(d);
                setLoading(false);
            });
    }, [page, pageSize, filters, props.refresh]);

    return (
        <>
            <Table
                {...props}
                loading={loading}
                data={data && data.data}
                filters={filters}
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
            <Block display={['none', 'none', 'block']}>
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
        </>
    );
});

export { PaginatedTable };
