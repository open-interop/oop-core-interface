import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQueryParam, NumberParam } from "use-query-params";
import Show from "baseui/icon/show";
import Menu from "baseui/icon/menu";
import { Button } from "baseui/button";
import { DataProvider, Pagination, Table } from "../Universal";
import OopCore from "../../OopCore";

const Devices = props => {
    const [devices, setDevices] = useState([]);
    const [page, setPage] = useQueryParam("page", NumberParam);
    const [pageSize, setPageSize] = useQueryParam("pageSize", NumberParam);

    // reset page number when the search query is changed
    useEffect(() => {
        setPage(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize]);

    return (
        <div className="content-wrapper">
            <div className="space-between">
                <h2>Devices</h2>
                <Button $as={Link} to={`/devices/new`}>
                    New
                </Button>
            </div>
            <DataProvider
                getData={() =>
                    OopCore.getDevices({ page, pageSize }).then(response => {
                        setDevices(response);
                        return response;
                    })
                }
                renderKey={props.location.search}
                renderData={() => (
                    <>
                        <Table
                            data={devices.data}
                            mapFunction={(columnName, content) => {
                                if (columnName === "action") {
                                    return (
                                        <>
                                            <Link to={`/devices/${content}`}>
                                                <Show />
                                            </Link>
                                            <Link
                                                to={`/devices/${content}/transmissions`}
                                            >
                                                <Menu />
                                            </Link>
                                        </>
                                    );
                                } else {
                                    return content;
                                }
                            }}
                            columns={[
                                { id: "id", name: "ID" },
                                { id: "name", name: "Name" },
                                { id: "deviceGroupId", name: "Group" },
                                { id: "siteId", name: "Site" },
                                { id: "action", name: "Action" },
                            ]}
                            columnContent={columnName => {
                                if (columnName === "action") {
                                    return "id";
                                }
                                return columnName;
                            }}
                        />
                        <Pagination
                            updatePageSize={pageSize => {
                                setPageSize(pageSize);
                            }}
                            currentPageSize={pageSize}
                            updatePageNumber={pageNumber => setPage(pageNumber)}
                            totalRecords={devices.totalRecords}
                            numberOfPages={devices.numberOfPages}
                            currentPage={page || 1}
                        />
                    </>
                )}
            />
        </div>
    );
};

export { Devices };
