import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faExternalLinkAlt,
    faCheck,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";

import { Button, KIND } from "baseui/button";

import {
    AccordionWithCaption,
    PaginatedTable,
    IconSpinner,
} from "../Universal";

import OopCore from "../../OopCore";

const TemprAssociator = props => {
    const [availableTemprs, setAvailableTemprs] = useState([]);
    const [temprFilterId, setTemprFilterId] = useState("");
    const [temprFilterName, setTemprFilterName] = useState("");
    const [temprFilterSelected, setTemprFilterSelected] = useState("");
    const [loading, setLoading] = useState(false);

    const selected = {};
    for (const s of props.selected) {
        selected[s.temprId] = s;
    }

    return (
        <AccordionWithCaption
            title={props.title || "Tempr Associations"}
            subtitle={props.subtitle || "Select temprs to associate"}
            error={props.error}
        >
            <PaginatedTable
                getData={async (pagination) => {
                    const temprs = await OopCore.getTemprs({ ...pagination, ...(props.temprsFilter || {}) });

                    setAvailableTemprs(temprs);

                    return temprs;
                }}
                rowClassName={row =>
                    `device-tempr${row.selected ? " selected" : ""}`
                }
                mapFunction={(columnName, content, row) => {
                    if (columnName === "action") {
                        return (
                            <>
                                <Button
                                    kind={KIND.minimal}
                                    $as={Link}
                                    target="_blank"
                                    to={"/temprs/" + content}
                                >
                                    <FontAwesomeIcon
                                        icon={faExternalLinkAlt}
                                    />
                                </Button>
                            </>
                        );
                    }
                    if (columnName === "selected") {
                        if (loading === row.id) {
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
                        hasFilter: false,
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
                filters={{
                    id: temprFilterId,
                    name: temprFilterName,
                    selected: temprFilterSelected,
                }}
                updateFilters={(key, value) => {
                    switch (key) {
                    case "id":
                            return setTemprFilterId(value);
                    case "name":
                            return setTemprFilterName(value);
                    case "selected":
                            if (value === null) {
                                return setTemprFilterSelected("");
                            }
                            return setTemprFilterSelected(value);
                    default:
                            return null;
                    }
                }}
                trueText="Selected"
                falseText="Not selected"
                onRowClick={async (tempr, column) => {
                    if (column !== "action" && !loading) {
                        setLoading(tempr.id);
                        if (selected[tempr.id]) {
                            await props.onDeselect(
                                tempr,
                                selected[tempr.id],
                            );
                        } else {
                            await props.onSelect(tempr);
                        }
                        setLoading(false);
                    }
                }}
            />
        </AccordionWithCaption>
    );
};

export default TemprAssociator;
