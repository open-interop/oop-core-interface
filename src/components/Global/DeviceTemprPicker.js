import React, { useState } from "react";
import { Pagination, Table } from "../Universal";
import { Button } from "baseui/button";
import { Check, Delete } from "baseui/icon";

const DeviceTemprPicker = props => {
    const [loading, setLoading] = useState(false);

    return (
        <>
            <Table
                data={props.items.data}
                mapFunction={(columnName, content) => {
                    if (columnName === "action") {
                        return (
                            <>
                                <Button
                                    onClick={() => {
                                        setLoading(content);
                                        return props
                                            .toggleItem(content)
                                            .then(response => {
                                                setLoading(false);
                                            })
                                            .catch(response => {
                                                setLoading(false);
                                            });
                                    }}
                                    disabled={loading}
                                    isLoading={loading === content}
                                >
                                    Toggle
                                </Button>
                            </>
                        );
                    }

                    if (columnName === "selected") {
                        return content ? <Check /> : <Delete />;
                    }

                    return content;
                }}
                columnContent={columnName => {
                    if (columnName === "action") {
                        return "id";
                    }

                    return columnName;
                }}
                columns={[
                    {
                        id: "id",
                        name: "Id",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "name",
                        name: "Name",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "selected",
                        name: "Selected",
                        type: "bool",
                        hasFilter: true,
                    },
                    {
                        id: "action",
                        name: "Action",
                        type: "action",
                        hasFilter: false,
                    },
                ]}
                filters={props.filters}
                updateFilters={props.updateFilters}
                trueText="Selected"
                falseText="Not selected"
            />
            <Pagination
                updatePageSize={pageSize => {
                    props.setPageSize(pageSize);
                }}
                currentPageSize={props.pageSize}
                updatePageNumber={pageNumber => props.setPage(pageNumber)}
                totalRecords={props.items.totalRecords}
                numberOfPages={props.items.numberOfPages}
                currentPage={props.page || 1}
            />
        </>
    );
};

export { DeviceTemprPicker };
