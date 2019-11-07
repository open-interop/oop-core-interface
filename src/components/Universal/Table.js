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
                                        props.onRowClick(row.id);
                                    }
                                }}
                                className={
                                    props.rowClassName
                                        ? props.rowClassName(row)
                                        : ""
                                }
                            >
                                {props.columns.map(column => (
                                    <CustomWidthComponent
                                        component={StyledCell}
                                        width={column.width}
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
                                            row.id,
                                        )}
                                    </CustomWidthComponent>
                                ))}
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

    const CustomWidthComponent = props => {
        var Head = props.component;
        if (props.width) {
            Head = withStyle(props.component, {
                maxWidth: props.width,
            });
        }
        return <Head {...props} />;
    };

    return (
        <StyledTable>
            <StyledHead>
                {props.columns.map(column => (
                    <CustomWidthComponent
                        component={StyledHeadCell}
                        width={column.width}
                        key={`table-head-${column.id}`}
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
                    </CustomWidthComponent>
                ))}
            </StyledHead>
            {TableRows()}
        </StyledTable>
    );
};

export { Table };
