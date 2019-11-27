import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, KIND } from "baseui/button";
import { DataProvider, Pagination, Table } from "../Universal";
import { useQueryParam, NumberParam, StringParam } from "use-query-params";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faCheck,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import OopCore from "../../OopCore";

const Transmissions = props => {
    useEffect(() => {
        document.title = "Transmissions | Open Interop";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [transmissions, setTransmissions] = useState(null);
    const [device, setDevice] = useState({});
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

    const getData = () => {
        return Promise.all([
            OopCore.getTransmissions(props.match.params.deviceId, {
                id,
                page,
                pageSize,
                transmissionUuid,
                messageUuid,
                status,
                success,
            }),
            OopCore.getDevice(props.match.params.deviceId),
        ]).then(([transmissions, device]) => {
            setTransmissions(transmissions);
            setDevice(device);
            return transmissions;
        });
    };

    const deviceDashboardPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    return (
        <div className="content-wrapper">
            <div className="flex-left">
                <Button
                    $as={Link}
                    kind={KIND.minimal}
                    to={deviceDashboardPath}
                    aria-label="Go back to device dashboard"
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
                <h2>
                    Transmissions -{" "}
                    {device
                        ? device.name
                        : `Device ${props.match.params.deviceId}`}
                </h2>
            </div>
            <DataProvider
                getData={() => {
                    return getData();
                }}
                renderData={() => (
                    <>
                        <Table
                            data={transmissions.data}
                            mapFunction={(columnName, content) => {
                                if (columnName === "action") {
                                    return (
                                        <Button
                                            kind={KIND.tertiary}
                                            $as={Link}
                                            to={`${props.location.pathname}/${content}`}
                                            aria-label="View transmission details"
                                        >
                                            View
                                        </Button>
                                    );
                                }

                                if (columnName === "success") {
                                    return content ? (
                                        <FontAwesomeIcon icon={faCheck} />
                                    ) : (
                                        <FontAwesomeIcon icon={faTimes} />
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
                                    width: "100px",
                                },
                                {
                                    id: "success",
                                    name: "Success",
                                    type: "bool",
                                    hasFilter: true,
                                },
                                {
                                    id: "transmittedAt",
                                    name: "Transmitted at",
                                    type: "text",
                                    hasFilter: false,
                                },
                                {
                                    id: "action",
                                    name: "",
                                    type: "action",
                                    hasFilter: false,
                                    width: "100px",
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
