import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { Select } from "baseui/select";
import { FormControl } from "baseui/form-control";
import { Accordion, Panel } from "baseui/accordion";
import { Input } from "baseui/input";
import ArrowLeft from "baseui/icon/arrow-left";
import { DataProvider, Error } from "../Universal";
import { PairInput } from "../Global";
import OopCore from "../../OopCore";
import { Timezones } from "../../resources/Timezones";

const Site = props => {
    const [site, setSite] = useState({});
    const [updatedSite, setUpdatedSite] = useState({});
    const [sites, setSites] = useState([]);
    const blankSite = props.match.params.siteId === "new";
    const [error, setError] = useState("");
    const timezones = Timezones.map(timezone => {
        return {
            id: timezone,
            name: timezone,
        };
    });

    const getSite = () => {
        return blankSite
            ? Promise.resolve({
                  account_id: "",
                  address: "",
                  city: "",
                  country: "",
                  description: "",
                  external_uuids: {},
                  latitude: "",
                  longitude: "",
                  name: "",
                  region: "",
                  site_id: "",
                  state: "",
                  time_zone: "",
                  zip_code: "",
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

    const getData = () => {
        return Promise.all([getSite(), OopCore.getSites()]).then(
            ([site, sites]) => {
                const filtered = sites.data.filter(
                    existingSite => existingSite.id !== site.id,
                );
                setSites(filtered);
                return site;
            },
        );
    };

    const accordionTitle = `${updatedSite.address || ""}, 
                ${updatedSite.zip_code || ""}, 
                ${updatedSite.city || ""}, 
                ${updatedSite.region || ""}, 
                ${updatedSite.state || ""}, 
                ${updatedSite.country || ""}, 
                ${updatedSite.latitude || ""}, 
                ${updatedSite.longitude || ""}`;

    return (
        <div className="content-wrapper">
            <Button $as={Link} to={allSitesPath}>
                <ArrowLeft size={24} />
            </Button>
            <h2>{blankSite ? "Create Site" : "Edit Site"}</h2>
            <DataProvider
                getData={() => {
                    return getData().then(response => refreshSite(response));
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
                        <FormControl
                            label="Description"
                            key={"form-control-group-description"}
                        >
                            <Input
                                id={"input-description"}
                                value={updatedSite.description || ""}
                                onChange={event =>
                                    setValue(
                                        "description",
                                        event.currentTarget.value,
                                    )
                                }
                            />
                        </FormControl>
                        <FormControl
                            label="Timezone"
                            key={"form-control-group-time-zone"}
                        >
                            <Select
                                options={timezones}
                                labelKey="name"
                                valueKey="id"
                                searchable={false}
                                onChange={event =>
                                    setValue("time_zone", event.value[0].id)
                                }
                                value={timezones.find(
                                    timezone =>
                                        timezone.id === updatedSite.time_zone,
                                )}
                            />
                        </FormControl>
                        <FormControl
                            label="Parent site"
                            key={"form-control-group-site-id"}
                        >
                            <Select
                                options={sites}
                                labelKey="name"
                                valueKey="id"
                                onChange={event => {
                                    setValue("site_id", event.value[0].id);
                                }}
                                value={
                                    sites.find(
                                        site => site.id === updatedSite.site_id,
                                    ) || null
                                }
                            />
                        </FormControl>

                        <Accordion>
                            <Panel title="Location">
                                <div className="content-wrapper">
                                    <FormControl
                                        label="Address"
                                        key={"form-control-group-address"}
                                    >
                                        <Input
                                            id={"input-address"}
                                            value={updatedSite.address || ""}
                                            onChange={event =>
                                                setValue(
                                                    "address",
                                                    event.currentTarget.value,
                                                )
                                            }
                                        />
                                    </FormControl>

                                    <FormControl
                                        label="Zip code"
                                        key={"form-control-zip-code"}
                                    >
                                        <Input
                                            id={"input-zip-code"}
                                            value={updatedSite.zip_code || ""}
                                            onChange={event =>
                                                setValue(
                                                    "zip_code",
                                                    event.currentTarget.value,
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormControl
                                        label="City"
                                        key={"form-control-group-city"}
                                    >
                                        <Input
                                            id={"input-city"}
                                            value={updatedSite.city || ""}
                                            onChange={event =>
                                                setValue(
                                                    "city",
                                                    event.currentTarget.value,
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormControl
                                        label="Region"
                                        key={"form-control-group-region"}
                                    >
                                        <Input
                                            id={"input-region"}
                                            value={updatedSite.region || ""}
                                            onChange={event =>
                                                setValue(
                                                    "region",
                                                    event.currentTarget.value,
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormControl
                                        label="State"
                                        key={"form-control-group-state"}
                                    >
                                        <Input
                                            id={"input-state"}
                                            value={updatedSite.state || ""}
                                            onChange={event =>
                                                setValue(
                                                    "state",
                                                    event.currentTarget.value,
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormControl
                                        label="Country"
                                        key={"form-control-group-country"}
                                    >
                                        <Input
                                            id={"input-country"}
                                            value={updatedSite.country || ""}
                                            onChange={event =>
                                                setValue(
                                                    "country",
                                                    event.currentTarget.value,
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormControl
                                        label="Latitude"
                                        key={"form-control-group-latitude"}
                                    >
                                        <Input
                                            id={"input-latitude"}
                                            value={updatedSite.latitude || ""}
                                            onChange={event =>
                                                setValue(
                                                    "latitude",
                                                    event.currentTarget.value,
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormControl
                                        label="Longitude"
                                        key={"form-control-group-longitude"}
                                    >
                                        <Input
                                            id={"input-longitude"}
                                            value={updatedSite.longitude || ""}
                                            onChange={event =>
                                                setValue(
                                                    "longitude",
                                                    event.currentTarget.value,
                                                )
                                            }
                                        />
                                    </FormControl>
                                </div>
                            </Panel>
                        </Accordion>
                        <FormControl
                            label="External UUIDs"
                            key={"form-control-group-external-uuids"}
                        >
                            <PairInput
                                data={updatedSite.external_uuids}
                                updateData={data =>
                                    setValue("external_uuids", data)
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
