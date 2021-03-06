import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Button, KIND } from "baseui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faHistory } from "@fortawesome/free-solid-svg-icons";
import { PaginatedTable, Page } from "../Universal";
import OopCore from "../../OopCore";

const Layers = memo(props => {
    return (
        <Page
            title="Layers | Settings | Open Interop"
            heading="Layers"
            actions={
                <Button
                    $as={Link}
                    to={`${props.location.pathname}/new`}
                    kind={KIND.minimal}
                    aria-label="Create new layer"
                    endEnhancer={() => <FontAwesomeIcon icon={faPlus} />}
                >
                    New
                </Button>
            }
        >
            <PaginatedTable
                getData={(pagination) => OopCore.getLayers(pagination)}
                mapFunction={(columnName, content) => {
                    if (columnName === "action") {
                        return (
                            <>
                                <Button
                                    kind={KIND.tertiary}
                                    $as={Link}
                                    to={`${props.location.pathname}/${content}`}
                                    aria-label="Edit Layer"
                                >
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                    />
                                </Button>
                                <Button
                                    kind={KIND.tertiary}
                                    $as={Link}
                                    to={{pathname: `${props.location.pathname}/${content}/audit-logs`, state: {from: `${props.location.pathname}`}}}
                                    aria-label="View Layer history"
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
                        id: "reference",
                        name: "Reference",
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
            />
        </Page>
    );
});

export default Layers;

