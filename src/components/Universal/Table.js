import React, { memo } from "react";

import { styled } from "styletron-react";
import {
    StyledTable,
    StyledHead,
    StyledBody,
    StyledRow,
    StyledCell,
    StyledHeadCell,
} from "baseui/table";

import { useStyletron } from "baseui";
import { TableFilter } from "../Global";

import { GifSpinner } from ".";

const LoadingOverlay = styled("div", props => ({
    top: 0,
    left: 0,
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "rgba(255, 255, 255, 0.8)",
}));

const Table = memo(props => {
    const [css, theme] = useStyletron();
    const data = props.data;

    const noItems = css({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.sizing.scale700,
        ...theme.typography.font350,
    });

    var widthPixels = false;

    if (props.mobile) {
        widthPixels = '930px';
    }

    function TableRows() {
        if (!(data instanceof Array)) {
            return <GifSpinner />;
        }

        if (data.length) {
            return (
                data.map((row, index) => {
                    return (
                        <StyledRow
                            key={index}
                            className={
                                props.rowClassName
                                    ? props.rowClassName(row)
                                    : ""
                            }
                        >
                            {props.columns.map(column => {
                                return (
                                    <StyledCell
                                        $style={column.width ? { flex: `0 0 ${column.width}`, } : {}}
                                        key={`table-cell-${index}-${column.id}`}
                                        onClick={() => {
                                            if (props.onRowClick) {
                                                props.onRowClick(
                                                    row,
                                                    column.id,
                                                );
                                            }
                                        }}
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
                            })}
                        </StyledRow>
                    );
                })
            );
        } else {
            return (
                <div className={noItems}>
                    No items to show
                </div>
            );
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
        <StyledTable style={{maxHeight: props.maxHeight || 'auto'}}>
            <StyledHead $width={widthPixels ? widthPixels : 'auto'}>
                {props.columns.map(column => (
                    <StyledHeadCell
                        $style={column.width ? { flex: `0 0 ${column.width}`, } : {}}
                        key={`table-head-${column.id}`}
                    >
                        {column.mapFunction ?
                            column.mapFunction(data)
                        :
                            column.name
                        }
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
                                trueText={column.trueText || props.trueText}
                                falseText={column.falseText || props.falseText}
                                zIndex={1}
                            />
                        )}
                    </StyledHeadCell>
                ))}
            </StyledHead>
            <StyledBody className={css({ position: "relative" })} $width={widthPixels ? widthPixels : 'auto'}>
                {TableRows()}
                {props.data && props.loading && (
                    <LoadingOverlay>
                        <GifSpinner />
                    </LoadingOverlay>
                )}
            </StyledBody>
        </StyledTable>
    );
});

export { Table };
