import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { DataProvider, Pagination, Table } from "../Universal";
import { useQueryParam, NumberParam, StringParam } from "use-query-params";

import Check from "baseui/icon/check";
import Delete from "baseui/icon/delete";
import OopCore from "../../OopCore";

const Transmissions = props => {
    const [transmissions, setTransmissions] = useState(null);
    const [page, setPage] = useQueryParam("page", NumberParam);
    const [pageSize, setPageSize] = useQueryParam("pageSize", NumberParam);
    const [id, setId] = useQueryParam("id", StringParam);
    const [transmissionUuid, setTransmissionUuid] = useQueryParam(
        "transmissionUuid",
        StringParam,
    );
    const [messageUuid, setMessageUuid] = useQueryParam(
        "messageUuid",
        StringParam,
    );
    const [status, setStatus] = useQueryParam("status", StringParam);
    const [success, setSuccess] = useQueryParam("success", StringParam);

    // reset page number when the search query is changed
    useEffect(() => {
        setPage(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, transmissionUuid, messageUuid, success]);

    return (
        <div className="content-wrapper">
            <h2>Transmissions - Device {props.match.params.deviceId}</h2>
            <DataProvider
                getData={() => {
                    return OopCore.getTransmissions(
                        props.match.params.deviceId,
                        {
                            id,
                            page,
                            pageSize,
                            transmissionUuid,
                            messageUuid,
                            status,
                            success,
                        },
                    ).then(response => {
                        setTransmissions(response);
                        return response;
                    });
                }}
                renderData={() => (
                    <>
                        <Table
                            data={transmissions.data}
                            mapFunction={(columnName, content) => {
                                if (columnName === "action") {
                                    return (
                                        <Button
                                            $as={Link}
                                            to={`${props.location.pathname}/${content}`}
                                        >
                                            {content}
                                        </Button>
                                    );
                                }

                                if (columnName === "success") {
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
                                    id: "device_tempr_id",
                                    name: "Device Tempr Id",
                                    type: "text",
                                    hasFilter: false,
                                },
                                {
                                    id: "transmissionUuid",
                                    name: "Transmission UUID",
                                    type: "text",
                                    hasFilter: true,
                                },
                                {
                                    id: "messageUuid",
                                    name: "Message UUID",
                                    type: "text",
                                    hasFilter: true,
                                },
                                {
                                    id: "status",
                                    name: "Status",
                                    type: "text",
                                    hasFilter: true,
                                },
                                {
                                    id: "success",
                                    name: "Success",
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
                            filters={{
                                id,
                                messageUuid,
                                transmissionUuid,
                                status,
                                success,
                            }}
                            updateFilters={(key, value) => {
                                switch (key) {
                                    case "id":
                                        return setId(value);
                                    case "transmissionUuid":
                                        return setTransmissionUuid(value);
                                    case "messageUuid":
                                        return setMessageUuid(value);
                                    case "status":
                                        return setStatus(value);
                                    case "success":
                                        return setSuccess(value);
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
                            totalRecords={transmissions.totalRecords}
                            numberOfPages={transmissions.numberOfPages}
                            currentPage={page || 1}
                        />
                    </>
                )}
                renderKey={props.location.search}
            />
        </div>
    );
};

export { Transmissions };
