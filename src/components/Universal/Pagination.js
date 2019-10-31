import React from "react";
import { Pagination as PaginationUI } from "baseui/pagination";
import { Select } from "baseui/select";

const pageSizeOptions = [
    { id: 10 },
    { id: 20 },
    { id: 40 },
    { id: 60 },
    { id: 80 },
    { id: 100 },
];

const Pagination = props => {
    return (
        <div className="pagination-footer">
            <Select
                options={pageSizeOptions}
                labelKey="id"
                valueKey="id"
                searchable={false}
                clearable={false}
                onChange={value => {
                    props.updatePageSize(value.option.id);
                }}
                value={
                    pageSizeOptions.find(
                        option => option.id === props.currentPageSize,
                    ) || {
                        id: 20,
                    }
                }
            />
            <div className="pagination-label">per page</div>
            <div className="pagination-label">
                {props.totalRecords}
                {props.totalRecords > 1 || props.totalRecords === 0
                    ? " records"
                    : " record"}
            </div>
            <PaginationUI
                numPages={props.numberOfPages}
                currentPage={props.currentPage}
                onPageChange={event => {
                    props.updatePageNumber(event.nextPage);
                }}
            />
        </div>
    );
};

export { Pagination };
