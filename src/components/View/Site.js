import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import ArrowLeft from "baseui/icon/arrow-left";
import { DataProvider, Error } from "../Universal";
import OopCore from "../../OopCore";

const Site = props => {
    const [site, setSite] = useState({});
    const [updatedSite, setUpdatedSite] = useState({});
    const blankSite = props.match.params.siteId === "new";
    const [error, setError] = useState("");

    const getSite = () => {
        return blankSite
            ? Promise.resolve({
                  id: "",
                  name: "",
              })
            : OopCore.getSite(props.match.params.siteId);
    };

    const refreshSite = site => {
        setSite(site);
        setUpdatedSite(site);
    };

    const allSitesPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    const setValue = (key, value) => {
        const updatedData = { ...updatedSite };
        updatedData[key] = value;
        setUpdatedSite(updatedData);
    };

    const identical = (oldObject, updatedObject) => {
        return Object.keys(oldObject).every(
            key => oldObject[key] === updatedObject[key],
        );
    };

    const saveButtonDisabled = () => {
        return identical(site, updatedSite);
    };

    return (
        <div className="content-wrapper">
            <Button $as={Link} to={allSitesPath}>
                <ArrowLeft size={24} />
            </Button>
            <h2>{blankSite ? "Create Site" : "Edit Site"}</h2>
            <DataProvider
                getData={() => {
                    return getSite().then(response => {
                        setSite(response);
                        setUpdatedSite(response);
                    });
                }}
                renderData={() => (
                    <>
                        <FormControl
                            label="Name"
                            key={"form-control-group-name"}
                        >
                            <Input
                                id={"input-name"}
                                value={updatedSite.name || ""}
                                onChange={event =>
                                    setValue("name", event.currentTarget.value)
                                }
                            />
                        </FormControl>

                        <Button
                            onClick={() => {
                                setError("");
                                if (blankSite) {
                                    return OopCore.createSite(updatedSite)
                                        .then(response => {
                                            refreshSite(response);
                                            props.history.replace(
                                                `${allSitesPath}/${response.id}`,
                                            );
                                        })
                                        .catch(err => {
                                            console.error(err);
                                            setError(
                                                "Something went wrong while creating the site",
                                            );
                                        });
                                } else {
                                    return OopCore.updateSite(
                                        props.match.params.siteId,
                                        updatedSite,
                                    )
                                        .then(response => {
                                            refreshSite(response);
                                        })
                                        .catch(err => {
                                            console.error(err);
                                            setError(
                                                "Something went wrong while saving site details ",
                                            );
                                        });
                                }
                            }}
                            disabled={saveButtonDisabled()}
                        >
                            {blankSite ? "Create" : "Save"}
                        </Button>
                        <Error message={error} />
                    </>
                )}
            />
        </div>
    );
};

export { Site };
