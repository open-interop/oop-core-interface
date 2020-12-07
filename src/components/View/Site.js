import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "baseui/button";
import { Select } from "baseui/select";
import { FormControl } from "baseui/form-control";
import { Accordion, Panel } from "baseui/accordion";
import { Input } from "baseui/input";
import { ConfirmModal, DataProvider, Page } from "../Universal";
import { clearToast, ErrorToast, PairInput, SuccessToast } from "../Global";
import OopCore from "../../OopCore";
import { identicalObject } from "../../Utilities";
import { Timezones } from "../../resources/Timezones";

const Site = props => {
    const [site, setSite] = useState({});
    const [updatedSite, setUpdatedSite] = useState({});
    const [siteErrors, setSiteErrors] = useState({});
    const [sites, setSites] = useState([]);
    const blankSite = props.match.params.siteId === "new";
    const timezones = Timezones.map(timezone => {
        return {
            id: timezone,
            name: timezone,
        };
    });

    const getSite = () => {
        return blankSite
            ? Promise.resolve({
                  accountId: "",
                  address: "",
                  city: "",
                  country: "",
                  description: "",
                  externalUuids: {},
                  latitude: "",
                  longitude: "",
                  name: "",
                  region: "",
                  siteId: "",
                  state: "",
                  timeZone: "",
                  zipCode: "",
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

    const deleteSite = () => {
        return OopCore.deleteSite(updatedSite.id)
            .then(() => {
                props.history.replace(`/sites`);
                SuccessToast("Deleted site", "Success");
            })
            .catch(error => {
                console.error(error);
                ErrorToast("Could not delete site", "Error");
            });
    };

    const saveSite = () => {
        clearToast();
        setSiteErrors({});
        if (blankSite) {
            return OopCore.createSite(updatedSite)
                .then(response => {
                    SuccessToast("Created new site", "Success");
                    refreshSite(response);
                    props.history.replace(`${allSitesPath}/${response.id}`);
                })
                .catch(error => {
                    setSiteErrors(error);
                    ErrorToast("Failed to create site", "Error");
                });
        } else {
            return OopCore.updateSite(props.match.params.siteId, updatedSite)
                .then(response => {
                    SuccessToast("Updated site", "Success");
                    refreshSite(response);
                })
                .catch(error => {
                    setSiteErrors(error);
                    ErrorToast("Failed to update site", "Error");
                });
        }
    };

    return (
        <Page
            title={
                blankSite
                    ? "New Site | Settings | Open Interop"
                    : "Edit Site | Settings | Open Interop"
            }
            heading={blankSite ? "Create Site" : "Edit Site"}
            actions={
                <>
                    {blankSite ? null : (
                        <Button
                            $as={Link}
                            to={`${props.location.pathname}/audit-logs`}
                            aria-label={"History"}
                        >
                            History
                        </Button>
                    )}
                    {blankSite ? null : (
                        <ConfirmModal
                            buttonText="Delete"
                            title="Confirm Deletion"
                            mainText={
                                <>
                                    <div>
                                        Are you sure you want to
                                        delete this site?
                                    </div>
                                    <div>
                                        This action can't be undone.
                                    </div>
                                </>
                            }
                            primaryAction={deleteSite}
                            primaryActionText="Delete"
                            secondaryActionText="Cancel"
                        />
                    )}
                    <Button
                        onClick={saveSite}
                        disabled={identicalObject(
                            site,
                            updatedSite,
                        )}
                        aria-label={
                            blankSite
                                ? "Create site"
                                : "Update site"
                        }
                    >
                        {blankSite ? "Create" : "Save"}
                    </Button>
                </>
            }
            backlink={allSitesPath}
        >
            <DataProvider
                getData={() => {
                    return getData().then(response => refreshSite(response));
                }}
                renderData={() => (
                    <>
                        <FormControl
                            label="Name"
                            key={"form-control-group-name"}
                            error={
                                siteErrors.name ? `Name ${siteErrors.name}` : ""
                            }
                            caption="required"
                        >
                            <Input
                                id={"input-name"}
                                value={updatedSite.name || ""}
                                onChange={event =>
                                    setValue("name", event.currentTarget.value)
                                }
                                error={siteErrors.name}
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
                                onChange={event => {
                                    event.value.length
                                        ? setValue(
                                              "timeZone",
                                              event.value[0].id,
                                          )
                                        : setValue("timeZone", null);
                                }}
                                value={timezones.filter(
                                    item => item.id === updatedSite.timeZone,
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
                                    event.value.length
                                        ? setValue("siteId", event.value[0].id)
                                        : setValue("siteId", null);
                                }}
                                value={sites.filter(
                                    item => item.id === updatedSite.siteId,
                                )}
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
                                            value={updatedSite.zipCode || ""}
                                            onChange={event =>
                                                setValue(
                                                    "zipCode",
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
                                data={updatedSite.externalUuids}
                                updateData={data =>
                                    setValue("externalUuids", data)
                                }
                            />
                        </FormControl>
                    </>
                )}
            />
        </Page>
    );
};

export default Site;
