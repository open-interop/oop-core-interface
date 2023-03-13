import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQueryParam, StringParam } from "use-query-params";
import { Button, KIND } from "baseui/button";
import { PaginatedTable, Page } from "../Universal";
import { ErrorToast } from "../Global";
import OopCore from "../../OopCore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartPie,
    faEdit,
    faListUl,
    faPlus,
    faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { arrayToObject } from "../../Utilities";

const Devices = props => {
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [id, setId] = useQueryParam("id", StringParam);
    const [name, setName] = useQueryParam("name", StringParam);
    const [deviceGroupId, setDeviceGroupId] = useQueryParam(
        "deviceGroupId",
        StringParam,
    );
    const [siteId, setSiteId] = useQueryParam("siteId", StringParam);

    // site selected in header overrides table filter
    if (
        props.site &&
        props.site.id &&
        (!siteId || Number(siteId) !== props.site.id)
    ) {
        setSiteId(String(props.site.id));
    }

    const getData = (pagination) => {
        return Promise.all([
            OopCore.getDevices(pagination),
            OopCore.getDeviceGroups(),
            OopCore.getSites(),
        ]).then(([devices, groups, sites]) => {
            const groupsObject = arrayToObject(groups.data, "id");
            const sitesObject = arrayToObject(sites.data, "id");

            devices.data.forEach(device => {
                device.deviceGroupName = groupsObject[device.deviceGroupId]
                    ? groupsObject[device.deviceGroupId].name
                    : "";
                device.siteName = sitesObject[device.siteId]
                    ? sitesObject[device.siteId].name
                    : "";
            });
            return devices;
        });
    };

    return (
        <Page
            heading="Devices"
            actions={
                <Button
                    $as={Link}
                    to={`/devices/new${
                        deviceGroupId ? "?deviceGroupId=" + deviceGroupId : ""
                    }`}
                    kind={KIND.minimal}
                    aria-label="Create new device"
                    endEnhancer={() => <FontAwesomeIcon icon={faPlus} />}
                >
                    New
                </Button>
            }
            title="Devices | Open Interop"
        >
            <PaginatedTable
                getData={getData}
                mapFunction={(columnName, content) => {
                    if (columnName === "action") {
                        return (
                            <>
                                <Button
                                    $as={Link}
                                    kind={KIND.minimal}
                                    to={`/devices/${content}`}
                                    aria-label="View device dashboard"
                                >
                                    <FontAwesomeIcon
                                        icon={faChartPie}
                                    />
                                </Button>
                                <Button
                                    $as={Link}
                                    kind={KIND.minimal}
                                    to={{
                                        pathname: `/devices/${content}/edit`,
                                        prevPath: props.location,
                                    }}
                                    aria-label="Edit device"
                                >
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                    />
                                </Button>
                                <Button
                                    $as={Link}
                                    kind={KIND.minimal}
                                    to={{pathname: `/devices/${content}/audit-logs`, state: {from: `/devices`}}}
                                    aria-label="View device history"
                                >
                                    <FontAwesomeIcon
                                        icon={faHistory}
                                    />
                                </Button>
                                <Button
                                    $as={Link}
                                    kind={KIND.minimal}
                                    to={`/messages?filter=originType-Device_originId-${content}`}
                                    aria-label="View device messages"
                                >
                                    <FontAwesomeIcon
                                        icon={faListUl}
                                    />
                                </Button>
                            </>
                        );
                    } else {
                        return content;
                    }
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
                        id: "deviceGroupName",
                        name: "Group",
                    },
                    {
                        id: "deviceGroupId",
                        name: "Group ID",
                        type: "text",
                        hasFilter: true,
                        width: "100px",
                    },

                    {
                        id: "siteName",
                        name: "Site",
                    },
                    {
                        id: "siteId",
                        name: "Site ID",
                        type: "text",
                        hasFilter: true,
                        width: "100px",
                    },
                    { id: "action", name: "", width: "200px" },
                ]}
                columnContent={columnName => {
                    if (columnName === "action") {
                        return "id";
                    }
                    return columnName;
                }}
                filters={{ deviceGroupId, id, name, siteId }}
                updateFilters={(key, value) => {
                    switch (key) {
                        case "deviceGroupId":
                            return setDeviceGroupId(value);
                        case "id":
                            return setId(value);
                        case "name":
                            return setName(value);
                        case "siteId":
                            if (!props.site || !props.site.id) {
                                return setSiteId(value);
                            } else {
                                return ErrorToast(
                                    "Please disable global site filtering (header) to allow table filter",
                                    "Site selection",
                                );
                            }

                        default:
                            return null;
                    }
                }}
            />
        </Page>
    );
};

export default Devices;
