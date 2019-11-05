import React from "react";
import {
    StyledTable,
    StyledHead,
    StyledBody,
    StyledRow,
    StyledCell,
    SortableHeadCell,
} from "baseui/table";
import { TableFilter } from "../Global";

const Table = props => {
    const data = props.data;

    function TableRows() {
        if (props.data.length) {
            return (
                <StyledBody>
                    {data.map((row, index) => (
                        <StyledRow key={index}>
                            {props.columns.map(column => (
                                <StyledCell
                                    key={`table-cell-${index}-${column.id}`}
                                >
                                    {props.mapFunction(
                                        column.id,
                                        row[
                                            props.columnContent
                                                ? props.columnContent(column.id)
                                                : column.id
                                        ],
                                    )}
                                </StyledCell>
                            ))}
                        </StyledRow>
                    ))}
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
                    <SortableHeadCell
                        key={`table-head-${column.id}`}
                        title={column.name}
                    >
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
                            />
                        )}
                    </SortableHeadCell>
                ))}
            </StyledHead>
            {TableRows()}
        </StyledTable>
    );
};

export { Table };
