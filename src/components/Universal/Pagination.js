import React from "react";
import { Pagination as PaginationUI } from "baseui/pagination";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";
import { useStyletron } from "baseui";
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
    const [css, theme] = useStyletron();

    console.log(theme);

    const Centered = props => {
        return (
            <div className={css({
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: theme.sizing.scale100,
                ...theme.typography.font350,
            })}>
                {props.children}
            </div>
        );
    };

    return (
        <div className={css({ display: "flex", flexDirection: "row", justifyContent: "space-between" })}>
            <div className={css({ display: "flex", flexDirection: "row" })}>
                <div>
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
                </div>
                <Centered>
                    Items per page
                </Centered>
            </div>
            <Centered>
                {props.totalRecords || 1}
                {props.totalRecords > 1 || props.totalRecords === 0
                    ? " records"
                    : " record"}
            </Centered>
            <div>
                <PaginationUI
                    numPages={props.numberOfPages}
                    currentPage={props.currentPage}
                    onPageChange={event => {
                        props.updatePageNumber(event.nextPage);
                    }}
                />
            </div>
        </div>
    );
};

export { Pagination };
