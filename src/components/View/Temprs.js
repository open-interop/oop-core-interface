import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { useQueryParam, NumberParam, StringParam } from "use-query-params";
import { DataProvider, Pagination, Table } from "../Universal";
import OopCore from "../../OopCore";

const Temprs = props => {
    const [temprs, setTemprs] = useState([]);
    const [page, setPage] = useQueryParam("page", NumberParam);
    const [pageSize, setPageSize] = useQueryParam("pageSize", NumberParam);
    const [id, setId] = useQueryParam("id", StringParam);
    const [name, setName] = useQueryParam("name", StringParam);
    const [deviceGroupId, setDeviceGroupId] = useQueryParam(
        "deviceGroupId",
        StringParam,
    );

    // reset page number when the search query is changed
    useEffect(() => {
        setPage(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, id, name, deviceGroupId]);

    const getData = () => {
        return Promise.all([
            OopCore.getTemprs({
                page,
                pageSize,
                id,
                name,
                deviceGroupId,
            }),
            OopCore.getDeviceGroups(),
        ]).then(([temprs, groups]) => {
            temprs.data = temprs.data.map(tempr => ({
                ...tempr,
                group: groups.data.some(
                    group => group.id === tempr.deviceGroupId,
                )
                    ? groups.data.find(
                          group => group.id === tempr.deviceGroupId,
                      ).name
                    : "No group name provided",
            }));
            return temprs;
        });
    };

    return (
        <div className="content-wrapper">
            <div className="space-between">
                <h2>Temprs</h2>
                <Button $as={Link} to={`${props.location.pathname}/new`}>
                    New
                </Button>
            </div>
            <DataProvider
                renderKey={props.location.search}
                getData={() => {
                    return getData().then(response => {
                        setTemprs(response);
                        return response;
                    });
                }}
                renderData={() => (
                    <>
                        <Table
                            data={temprs.data}
                            mapFunction={(columnName, content) => {
                                if (columnName === "action") {
                                    return (
                                        <>
                                            <Button
                                                $as={Link}
                                                to={`${props.location.pathname}/${content}`}
                                            >
                                                Edit
                                            </Button>
                                        </>
                                    );
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
                                    width: "50px",
                                },
                                {
                                    id: "name",
                                    name: "Name",
                                    type: "text",
                                    hasFilter: true,
                                },
                                {
                                    id: "group",
                                    name: "Group",
                                    type: "text",
                                    hasFilter: false,
                                },
                                {
                                    id: "deviceGroupId",
                                    name: "Group ID",
                                    type: "text",
                                    hasFilter: true,
                                    width: "100px",
                                },
                                {
                                    id: "action",
                                    name: "",
                                    type: "action",
                                    hasFilter: false,
                                    width: "50px",
                                },
                            ]}
                            filters={{ id, name, deviceGroupId }}
                            updateFilters={(key, value) => {
                                switch (key) {
                                    case "id":
                                        return setId(value);
                                    case "name":
                                        return setName(value);
                                    case "deviceGroupId":
                                        return setDeviceGroupId(value);
                                    default:
                                        return null;
                                }
                            }}
                        />
                        <Pagination
                            updatePageSize={pageSize => {
                                setPageSize(pageSize);
                            }}
                            currentPageSize={pageSize}
                            updatePageNumber={pageNumber => setPage(pageNumber)}
                            totalRecords={temprs.totalRecords}
                            numberOfPages={temprs.numberOfPages}
                            currentPage={page || 1}
                        />
                    </>
                )}
            />
        </div>
    );
};

export { Temprs };
