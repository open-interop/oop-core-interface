import React, { useState, memo } from "react";

import { Link } from "react-router-dom";
import { Button, KIND } from "baseui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faExternalLinkAlt,
    faCheck,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";

import {
    AccordionWithCaption,
    IconSpinner,
    PaginatedTable,
} from "../Universal";

import OopCore from "../../OopCore";

const getData = (pagination) => {
    return OopCore.getLayers({
        //layerGroupId: updatedTempr.layerGroupId,
        ...pagination,
    });
};

const LayerAssociator = memo(props => {
    const [layerTemprLoading, setLayerTemprLoading] = useState(false);

    const selected = {};
    // eslint-disable-next-line no-unused-vars
    for (const layerTempr of props.selected) {
        selected[layerTempr.layerId] = layerTempr;
    }

    return (
        <AccordionWithCaption
            title="Layer Associations "
            subtitle="Select layers to associate with this tempr"
            error={props.error}
            startOpen={props.startOpen || false}
        >
            <PaginatedTable
                prefix="layer-"
                getData={getData}
                rowClassName={row =>
                    `layer-tempr${row.selected ? " selected" : ""}`
                }
                mapFunction={(columnName, content, row) => {
                    if (columnName === "action") {
                        return (
                            <>
                                <Button
                                    kind={KIND.minimal}
                                    $as={Link}
                                    target="_blank"
                                    to={"/layers/" + content}
                                >
                                    <FontAwesomeIcon
                                        icon={faExternalLinkAlt}
                                    />
                                </Button>
                            </>
                        );
                    }

                    if (columnName === "selected") {
                        if (layerTemprLoading === row.id) {
                            return <IconSpinner />;
                        }
                        return selected[row.id] ? (
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
                        id: "selected",
                        name: "",
                        type: "bool",
                        hasFilter: true,
                        width: "20px",
                    },
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
                        id: "action",
                        name: "",
                        type: "action",
                        hasFilter: false,
                        width: "30px",
                    },
                ]}
                trueText="Selected"
                falseText="Not selected"
                onRowClick={async (layer, column) => {
                    if (column !== "action" && !layerTemprLoading) {
                        setLayerTemprLoading(layer.id);

                        if (selected[layer.id]) {
                            await props.onDeselect(layer, selected[layer.id]);
                        } else {
                            await props.onSelect(layer);
                        }

                        setLayerTemprLoading(false);
                    }
                }}
            />
        </AccordionWithCaption>
    );
});

export default LayerAssociator;
