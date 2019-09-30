import React, { useState } from "react";
import {
    StyledTable,
    StyledHead,
    StyledBody,
    StyledRow,
    StyledCell,
    SortableHeadCell,
    SORT_DIRECTION,
} from "baseui/table";
import { TableFilter } from "../Universal";

const SortableTable = props => {
    const data = props.data;
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);

    const getNextDirection = currentDirection => {
        switch (currentDirection) {
            case null:
                return SORT_DIRECTION.DESC;
            case SORT_DIRECTION.DESC:
                return SORT_DIRECTION.ASC;
            case SORT_DIRECTION.ASC:
                return null;
            default:
                return null;
        }
    };

    const handleSort = column => {
        if (sortColumn === column) {
            const nextDirection = getNextDirection(sortDirection);
            if (nextDirection === null) {
                setSortColumn(null);
            }
            setSortDirection(nextDirection);
        } else {
            setSortColumn(column);
            setSortDirection(SORT_DIRECTION.DESC);
        }
    };

    const getSortedData = () => {
        if (sortColumn === null || sortDirection === null) {
            return data;
        }

        const sortFunction = (sortColumn, a, b) => {
            if (typeof a[sortColumn] === "string") {
                return b[sortColumn]
                    .toLowerCase()
                    .localeCompare(a[sortColumn].toLowerCase());
            } else {
                return a[sortColumn] < b[sortColumn];
            }
        };

        const sortedData = [...data].sort((a, b) =>
            sortFunction(sortColumn, a, b),
        );

        if (sortDirection === SORT_DIRECTION.DESC) {
            return sortedData.reverse();
        }

        return sortedData;
    };

    function TableRows() {
        if (props.data.length) {
            return (
                <StyledBody>
                    {getSortedData().map((row, index) => (
                        <StyledRow key={index}>
                            {props.columns.map(column => (
                                <StyledCell
                                    key={`table-cell-${index}-${column.id}`}
                                >
                                    {props.mapFunction(
                                        column.id,
                                        row[column.id],
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
                filterName => filterName === column,
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
                        direction={
                            sortColumn === column.id ? sortDirection : null
                        }
                        onSort={() => handleSort(column.id)}
                    >
                        {column.hasFilter && (
                            <TableFilter
                                contentType={column.type}
                                filterValue={getFilterValue(
                                    props.filters,
                                    column.id,
                                )}
                                setFilterValue={newValue =>
                                    props.updateFilters({
                                        [column.id]: newValue,
                                    })
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

export { SortableTable };
