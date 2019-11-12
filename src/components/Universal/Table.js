import React from "react";
import {
    StyledTable,
    StyledHead,
    StyledBody,
    StyledRow,
    StyledCell,
    StyledHeadCell,
} from "baseui/table";
import { withStyle } from "baseui";
import { TableFilter } from "../Global";

const Table = props => {
    const data = props.data;

    function TableRows() {
        if (props.data.length) {
            return (
                <StyledBody>
                    {data.map((row, index) => {
                        return (
                            <StyledRow
                                key={index}
                                onClick={() => {
                                    if (props.onRowClick) {
                                        props.onRowClick(row);
                                    }
                                }}
                                className={
                                    props.rowClassName
                                        ? props.rowClassName(row)
                                        : ""
                                }
                            >
                                {props.columns.map(column => {
                                    if (column.width) {
                                        const CustomWidthCell = withStyle(
                                            StyledCell,
                                            {
                                                maxWidth: column.width,
                                            },
                                        );

                                        return (
                                            <CustomWidthCell
                                                key={`table-cell-${index}-${column.id}`}
                                            >
                                                {props.mapFunction(
                                                    column.id,
                                                    row[
                                                        props.columnContent
                                                            ? props.columnContent(
                                                                  column.id,
                                                              )
                                                            : column.id
                                                    ],
                                                    row,
                                                )}
                                            </CustomWidthCell>
                                        );
                                    } else {
                                        return (
                                            <StyledCell
                                                key={`table-cell-${index}-${column.id}`}
                                            >
                                                {props.mapFunction(
                                                    column.id,
                                                    row[
                                                        props.columnContent
                                                            ? props.columnContent(
                                                                  column.id,
                                                              )
                                                            : column.id
                                                    ],
                                                    row,
                                                )}
                                            </StyledCell>
                                        );
                                    }
                                })}
                            </StyledRow>
                        );
                    })}
                </StyledBody>
            );
        } else {
            return <StyledBody>No items to show</StyledBody>;
        }
    }

    function getFilterValue(filters, column) {
        if (filters) {
            return Object.keys(filters).find(
                filterName =>
                    filterName === column && filters[filterName] !== undefined,
            )
                ? props.filters[column]
                : "";
        }

        return "";
    }

    return (
        <StyledTable>
            <StyledHead>
                {props.columns.map(column => (
                    <StyledHeadCell
                        width={column.width}
                        key={`table-head-${column.id}`}
                        className={`max-width-${column.width}`}
                    >
                        {column.name}
                        {column.hasFilter && (
                            <TableFilter
                                contentType={column.type}
                                filterValue={getFilterValue(
                                    props.filters,
                                    column.id,
                                )}
                                setFilterValue={newValue =>
                                    props.updateFilters(column.id, newValue)
                                }
                                trueText={props.trueText}
                                falseText={props.falseText}
                            />
                        )}
                    </StyledHeadCell>
                ))}
            </StyledHead>
            {TableRows()}
        </StyledTable>
    );
};

export { Table };
