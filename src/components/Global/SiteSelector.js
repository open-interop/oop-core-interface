import React, { useState } from "react";
import { Select } from "baseui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faCheck } from "@fortawesome/free-solid-svg-icons";
import OopCore from "../../OopCore";
import { DataProvider } from "../Universal";

const SiteSelector = props => {
    const [currentSiteName, setCurrentSiteName] = useState("");
    const [parentDropdownOpen, setParentDropdownOpen] = useState(false);
    const [childDropdownOpen, setChildDropdownOpen] = useState(false);
    const [parentSites, setParentSites] = useState([]);
    const [childSites, setChildSites] = useState([]);
    const [parentSearchValue, setParentSearchValue] = useState("");
    const [childSearchValue, setChildSearchValue] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const getParentSites = () => {
        if (parentSearchValue) {
            return OopCore.getSites({
                name: parentSearchValue,
            });
        } else {
            return OopCore.getSites();
        }
    };

    const getChildSites = () => {
        if (childSearchValue) {
            return OopCore.getSites({
                name: childSearchValue,
                siteId: selectedParentSites[0].id,
            });
        } else {
            return OopCore.getSites({ siteId: selectedParentSites[0].id });
        }
    };

    const selectedParentSites = props.selectedSite
        ? props.selectedSite.parentId
            ? parentSites.filter(
                  site => site.id === props.selectedSite.parentId,
              )
            : parentSites.filter(site => site.id === props.selectedSite.id)
        : null;

    const selectedChildSites = props.selectedSite
        ? childSites.filter(site => site.id === props.selectedSite.id)
        : null;

    const selectSite = (siteId, parentId) => {
        if (parentId) {
            return props.selectSite({
                id: siteId,
                parentId: parentId,
            });
        }

        if (siteId) {
            return props.selectSite({
                id: siteId,
            });
        }

        return props.selectSite(null);
    };

    const getCurrentSiteName = () => {
        if (props.selectedSite) {
            return OopCore.getSite(props.selectedSite.id).then(
                response => response.fullName,
            );
        } else {
            return Promise.resolve("All sites");
        }
    };

    if (isEditing) {
        return (
            <>
                <DataProvider
                    getData={() => {
                        return getParentSites().then(response => {
                            setParentSites(response.data);
                            return response;
                        });
                    }}
                    renderKey={parentDropdownOpen + parentSearchValue}
                    renderData={() => {
                        return (
                            <>
                                <props.wrapper>
                                    <div className="site-selector">
                                        <Select
                                            options={parentSites}
                                            autoFocus={
                                                !(
                                                    props.selectedSite &&
                                                    props.selectedSite.parentId
                                                )
                                            }
                                            startOpen={
                                                !(
                                                    props.selectedSite &&
                                                    props.selectedSite.parentId
                                                )
                                            }
                                            labelKey="name"
                                            valueKey="id"
                                            filterOptions={options =>
                                                options.filter(
                                                    option => !option.siteId,
                                                )
                                            }
                                            onChange={event => {
                                                event.value.length
                                                    ? selectSite(
                                                        event.value[0].id,
                                                      )
                                                    : selectSite(null);
                                            }}
                                            onInputChange={event =>
                                                setParentSearchValue(
                                                    event.currentTarget.value,
                                                )
                                            }
                                            value={selectedParentSites}
                                            placeholder="All sites"
                                            onOpen={() =>
                                                setParentDropdownOpen(
                                                    !parentDropdownOpen,
                                                )
                                            }
                                        />
                                    </div>
                                </props.wrapper>
                            </>
                        );
                    }}
                />
                {selectedParentSites && selectedParentSites.length ? (
                    <DataProvider
                        getData={() => {
                            return getChildSites().then(response => {
                                setChildSites(response.data);
                                return response;
                            });
                        }}
                        renderKey={childSearchValue + props.selectedSite.id}
                        renderData={() => {
                            return (
                                <>
                                    {childSites.length ? (
                                        <props.wrapper>
                                            <div className="site-selector">
                                                <Select
                                                    options={childSites}
                                                    autoFocus={
                                                        (props.selectedSite &&
                                                            props.selectedSite
                                                                .parentId) ||
                                                        childSites.length
                                                    }
                                                    startOpen={
                                                        (props.selectedSite &&
                                                            props.selectedSite
                                                                .parentId) ||
                                                        childSites.length
                                                    }
                                                    labelKey="name"
                                                    valueKey="id"
                                                    onChange={event => {
                                                        event.value.length
                                                            ? selectSite(
                                                                event.value[0]
                                                                      .id,
                                                                selectedParentSites[0]
                                                                      .id,
                                                            )
                                                            : selectSite(
                                                                  selectedParentSites[0]
                                                                    .id,
                                                              );
                                                    }}
                                                    onInputChange={event =>
                                                        setChildSearchValue(
                                                            event.currentTarget
                                                                .value,
                                                        )
                                                    }
                                                    value={selectedChildSites}
                                                    onOpen={() =>
                                                        setChildDropdownOpen(
                                                            !childDropdownOpen,
                                                        )
                                                    }
                                                    placeholder="Child sites"
                                                />
                                            </div>
                                        </props.wrapper>
                                    ) : null}
                                </>
                            );
                        }}
                        loadingFallback={null}
                    />
                ) : null}
                <props.wrapper>
                    <div className="icon" onClick={() => setIsEditing(false)}>
                        <FontAwesomeIcon icon={faCheck} />
                    </div>
                </props.wrapper>
            </>
        );
    } else {
        return (
            <DataProvider
                getData={() =>
                    getCurrentSiteName().then(name => setCurrentSiteName(name))
                }
                renderKey={isEditing}
                renderData={() => {
                    return (
                        <props.wrapper>
                            <div className="selected-site">
                                {currentSiteName}
                                <span
                                    className="icon"
                                    onClick={() => setIsEditing(true)}
                                >
                                    {" "}
                                    <FontAwesomeIcon icon={faEdit} />
                                </span>
                            </div>
                        </props.wrapper>
                    );
                }}
            />
        );
    }
};

export { SiteSelector };
