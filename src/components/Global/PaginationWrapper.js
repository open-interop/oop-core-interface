import React, { useState } from "react";
import { Pagination } from "baseui/pagination";
import { Select } from "baseui/select";

const PaginationWrapper = props => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState({ id: 20, name: 20 });
    const itemsOnPage = pageSize.id;
    const dataSlice = props.data.slice(
        (currentPage - 1) * itemsOnPage,
        currentPage * itemsOnPage,
    );

    return (
        <>
            {props.render(dataSlice)}
            <div className="pagination-footer">
                <Select
                    clearable={false}
                    options={[
                        { id: 10, name: 10 },
                        { id: 20, name: 20 },
                        { id: 30, name: 30 },
                    ]}
                    labelKey="id"
                    valueKey="name"
                    onChange={value => {
                        setPageSize(value.option);
                    }}
                    value={pageSize}
                />
                <div className="select-label">per page</div>
                <Pagination
                    numPages={
                        props.data
                            ? Math.ceil(props.data.length / itemsOnPage)
                            : 0
                    }
                    currentPage={currentPage}
                    onPageChange={({ nextPage }) => {
                        setCurrentPage(Math.min(Math.max(nextPage, 1), 20));
                    }}
                />
            </div>
        </>
    );
};

export { PaginationWrapper };
