import React from "react";
import { Pagination as PaginationUI } from "baseui/pagination";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";
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
        <Grid behavior={BEHAVIOR.fluid} >
            <Cell span={1}>
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
                        [pageSizeOptions.find(
                            option => option.id === props.currentPageSize,
                        ) || {
                            id: 20,
                        }]
                    }
                />
            </Cell>
            <Cell span={1}>
                per page
            </Cell>
            <Cell span={1}>
                {props.totalRecords}
                {props.totalRecords > 1 || props.totalRecords === 0
                    ? " records"
                    : " record"}
            </Cell>
            <Cell span={3} skip={6}>
                <PaginationUI
                    numPages={props.numberOfPages}
                    currentPage={props.currentPage}
                    onPageChange={event => {
                        props.updatePageNumber(event.nextPage);
                    }}
                />
            </Cell>
        </Grid>
    );
};

export { Pagination };
