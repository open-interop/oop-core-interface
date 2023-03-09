import React, { useEffect, useState } from "react";

import { Link, useHistory } from "react-router-dom";
import { useQueryParam, StringParam, ObjectParam } from "use-query-params";

import { Button, KIND } from "baseui/button";
import { Checkbox } from "baseui/checkbox";
import { useStyletron } from "baseui";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";

import { PaginatedTable, Page, DatetimeTooltip } from "../Universal";
import OopCore from "../../OopCore";

const Transmissions = props => {
    useEffect(() => {
        document.title = "Transmissions | Open Interop";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const history = useHistory();

    const [id, setId] = useQueryParam("id", StringParam);
    const [deviceId, setDeviceId] = useQueryParam("deviceId", StringParam);
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
    const [transmittedAt, setTransmittedAt] = useQueryParam("transmittedAt", ObjectParam);
    const [retried, setRetried] = useQueryParam("retried", StringParam);

    const [checkedTransmissions, setCheckedTransmissions] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [retryingTransmissions, setRetryingTransmissions] = useState(false);

    const deviceDashboardPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    const ItemsSelectedRow = props => {
        const [css, theme] = useStyletron();
    
        return <div className={css({ display: "flex", marginBottom: theme.sizing.scale500, justifyContent: "space-between", alignItems: "center" })} >
            {checkedTransmissions.length} items selected
            <Button
                kind={KIND.secondary}
                disabled={!checkedTransmissions.length}
                onClick={onPressConfirm}
                isLoading={retryingTransmissions}
            >
                Retry
            </Button>
        </div>
    }; 

    const onCheckRow = (id) => {
        const newCheckedTransmissions = [...checkedTransmissions];
        const index = checkedTransmissions.indexOf(id)
        if(index !== -1){
            newCheckedTransmissions.splice(index, 1);
            setAllChecked(false)
        } else {
            newCheckedTransmissions.push(id)
        }
        setCheckedTransmissions(newCheckedTransmissions)
    }

    const onSelectAll = (data) => {
        console.log("hey")
        const newCheckedTransmissions = [];
        if(allChecked){
            setCheckedTransmissions([])
        } else {
            console.log(data)
            for (const item of data){
                newCheckedTransmissions.push(item.id)
            }
            setCheckedTransmissions(newCheckedTransmissions);
        }
        setAllChecked(!allChecked)
    }

    const onPressConfirm = async () => {
        setRetryingTransmissions(true);
        for(const transmissionId of checkedTransmissions){
            await OopCore.retryTransmission(transmissionId);
        }
        history.go(0)
        setRetryingTransmissions(false);
    }

    return (
        <Page
            heading="Transmissions"
            backlink={deviceDashboardPath}
        >
            <ItemsSelectedRow />
            <PaginatedTable
                getData={(pagination) => {
                    return OopCore.getTransmissions(pagination);
                }}
                mapFunction={(columnName, content) => {
                    if (columnName === "action") {
                        return (
                            <Button
                                kind={KIND.tertiary}
                                $as={Link}
                                to={`/transmissions/${content}`}
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

                    if (columnName === "deviceId") {
                        return content ? content : "N/A"
                    }


                    if (columnName === "scheduleId") {
                        return content ? content : "N/A"
                    }

                    if (columnName === "transmittedAt") {
                        return (
                            <DatetimeTooltip time={content}></DatetimeTooltip>
                        );
                    }

                    if (columnName === "id") {
                        return (
                            <Checkbox
                            onChange={() => onCheckRow(content)}
                            checked={checkedTransmissions.indexOf(content) !== -1}
                        />
                    );
                    }
                    if (columnName === "retried") {
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
                        name: "",
                        width: "50px",
                        mapFunction: (data) => {
                            return  <Checkbox
                            onChange={() => onSelectAll(data)}
                            checked={allChecked}
                        />
                        }
                    },
                    {
                        id: "deviceId",
                        name: "Device Id",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "scheduleId",
                        name: "Schedule Id",
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
                        type: "datetime",
                        hasFilter: true,
                    },
                    {
                        id: "retried",
                        name: "Retried",
                        type: "bool",
                        hasFilter: true,
                        trueText: "Retried",
                        falseText: "Not retried"
                    },
                    {
                        id: "customFieldA",
                        name: "Field A",
                        type: "text",
                        hasFilter: true,
                    },
                    {
                        id: "customFieldB",
                        name: "Field B",
                        type: "text",
                        hasFilter: true,
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
                    deviceId,
                    messageUuid,
                    transmissionUuid,
                    status,
                    success,
                    transmittedAt,
                    retried
                }}
                updateFilters={(key, value) => {
                    switch (key) {
                        case "id":
                            return setId(value);
                        case "deviceId":
                            return setDeviceId(value);
                        case "transmissionUuid":
                            return setTransmissionUuid(value);
                        case "messageUuid":
                            return setMessageUuid(value);
                        case "status":
                            return setStatus(value);
                        case "success":
                            return setSuccess(value);
                        case "transmittedAt":
                            return setTransmittedAt(value);
                        case "retried":
                            return setRetried(value);
                        default:
                            return null;
                    }
                }}
            />
        </Page>
    );
};

export default Transmissions;
