import React from "react";
import { Link } from "react-router-dom";

import { Button, KIND } from "baseui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faHistory } from "@fortawesome/free-solid-svg-icons";
import { useQueryParam, StringParam } from "use-query-params";

import { PaginatedTable, Page } from "../Universal";
import OopCore from "../../OopCore";

const Temprs = props => {

    const [id, setId] = useQueryParam("id", StringParam);
    const [name, setName] = useQueryParam("name", StringParam);
    const [deviceGroupId, setDeviceGroupId] = useQueryParam(
        "deviceGroupId",
        StringParam,
    );

    const getData = (pagination) => {
        return Promise.all([
            OopCore.getTemprs(pagination),
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
        <Page
            title="Temprs | Settings | Open Interop"
            heading="Temprs"
            actions={
                <Button
                    $as={Link}
                    to={`${props.location.pathname}/new`}
                    kind={KIND.minimal}
                    aria-label="Create new tempr"
                    endEnhancer={() => <FontAwesomeIcon icon={faPlus} />}
                >
                    New
                </Button>
            }
        >
            <PaginatedTable
                getData={(pagination) => {
                    return getData(pagination).then(response => {
                        return response;
                    });
                }}
                mapFunction={(columnName, content) => {
                    if (columnName === "action") {
                        return (
                            <>
                                <Button
                                    kind={KIND.tertiary}
                                    $as={Link}
                                    to={`${props.location.pathname}/${content}`}
                                    aria-label="Edit tempr"
                                >
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                    />
                                </Button>
                                <Button
                                    kind={KIND.tertiary}
                                    $as={Link}
                                    to={{pathname: `${props.location.pathname}/${content}/audit-logs`, state: {from: `${props.location.pathname}`}}}
                                    aria-label="View tempr history"
                                >
                                    <FontAwesomeIcon
                                        icon={faHistory}
                                    />
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
                        name: "ID",
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
                        width: "100px",
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
        </Page>
    );
};

export default Temprs;
