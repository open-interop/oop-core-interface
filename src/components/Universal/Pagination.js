import React from "react";
import { Pagination as PaginationUI } from "baseui/pagination";
import { Select } from "baseui/select";

const Pagination = props => {
    return (
        <div className="pagination-footer">
            <Select
                options={props.pageSizeOptions}
                labelKey="id"
                valueKey="id"
                searchable={false}
                clearable={false}
                onChange={value => {
                    props.updatePageSize(value.option.id);
                }}
                value={props.currentPageSize}
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
