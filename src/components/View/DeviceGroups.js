import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Button, KIND } from "baseui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faHistory } from "@fortawesome/free-solid-svg-icons";
import { PaginatedTable, Page } from "../Universal";
import OopCore from "../../OopCore";

const DeviceGroups = memo(props => {
    return (
        <Page
            title="Device Groups | Settings | Open Interop"
            heading="Device Groups"
            actions={
                <Button
                    $as={Link}
                    to={`/device-groups/new`}
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
                    return OopCore.getDeviceGroups(pagination);
                }}
                mapFunction={(columnName, content) => {
                    if (columnName === "action") {
                        return (
                            <>
                                <Button
                                    kind={KIND.tertiary}
                                    $as={Link}
                                    to={`/device-groups/${content}`}
                                    aria-label="Edit device group"
                                >
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                    />
                                </Button>
                                <Button
                                    kind={KIND.tertiary}
                                    $as={Link}
                                    to={{pathname: `/device-groups/${content}/audit-logs`, state: { from: `/device-groups` }}}
                                    aria-label="View device group history"
                                >
                                    <FontAwesomeIcon
                                        icon={faHistory}
                                    />
                                </Button>

                                <Button
                                    $as={Link}
                                    kind={KIND.tertiary}
                                    to={`devices?filter=deviceGroupId-${content}`}
                                    aria-label="View devices for this group"
                                >
                                    Devices
                                </Button>
                                <Button
                                    $as={Link}
                                    kind={KIND.tertiary}
                                    to={`/temprs?filter=deviceGroupId-${content}`}
                                    aria-label="View temprs for this group"
                                >
                                    Temprs
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
                        id: "action",
                        name: "",
                        type: "action",
                        hasFilter: false,
                        width: "300px",
                    },
                ]}
            />
        </Page>
    );
});

export default DeviceGroups;
