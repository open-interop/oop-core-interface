import React, { useState } from "react";

import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Select } from "baseui/select";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";

import { ConfirmModal, DataProvider, Page } from "../Universal";
import { clearToast, ErrorToast, SuccessToast, PairInput } from "../Global";
import { identicalObject } from "../../Utilities";
import OopCore from "../../OopCore";

const BlacklistEntry = props => {
    const [blacklistEntry, setBlacklistEntry] = useState({});
    const [ipLiteralFlag, setIpLiteralFlag] = useState(null);
    const [pathLiteralFlag, setPathLiteralFlag] = useState(null);
    const [updatedBlacklistEntry, setUpdatedBlacklistEntry] = useState({});
    const [blacklistEntryErrors, setBlacklistEntryErrors] = useState({});
    const blankBlacklistEntry = props.match.params.blacklistEntryId === "new";

    const getBlacklistEntry = () => {
        return blankBlacklistEntry
            ? Promise.resolve({
                  ipLiteral: "",
                  ipRange: "",
                  pathLiteral: "",
                  pathRegex: "",
                  headers: "",
              })
            : OopCore.getBlacklistEntry(props.match.params.blacklistEntryId);
    };

    const refreshBlacklistEntry = blacklistEntry => {
        setBlacklistEntry(blacklistEntry);
        setUpdatedBlacklistEntry(blacklistEntry);
    };

    const allBlacklistEntriesPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    const setValue = (key, value) => {
        const updatedData = { ...updatedBlacklistEntry };
        updatedData[key] = value;
        setUpdatedBlacklistEntry(updatedData);
    };

    const deleteBlacklistEntry = () => {
        return OopCore.deleteBlacklistEntry(updatedBlacklistEntry.id)
            .then(() => {
                props.history.replace(`/blacklist-entries`);
                SuccessToast("Deleted blacklist entry", "Success");
            })
            .catch(error => {
                console.error(error);
                ErrorToast("Could not delete blacklist entry", "Error");
            });
    };

    const saveBlacklistEntry = () => {
        clearToast();
        setBlacklistEntryErrors({});
        if (blankBlacklistEntry) {
            return OopCore.createBlacklistEntry(updatedBlacklistEntry)
                .then(response => {
                    SuccessToast("Created new blacklist entry", "Success");
                    refreshBlacklistEntry(response);
                    props.history.replace(`${allBlacklistEntriesPath}/${response.id}`);
                })
                .catch(error => {
                    setBlacklistEntryErrors(error);
                    ErrorToast("Failed to create blacklist entry", "Error");
                });
        } else {
            return OopCore.updateBlacklistEntry(props.match.params.blacklistEntryId, updatedBlacklistEntry)
                .then(response => {
                    refreshBlacklistEntry(response);
                    SuccessToast("Updated blacklist entry", "Success");
                })
                .catch(error => {
                    setBlacklistEntryErrors(error);
                    ErrorToast("Failed to update blacklist entry", "Error");
                });
        }
    };

    const toggleIpLiteralRange = () => {
        if (ipLiteralFlag) {
            let ip = updatedBlacklistEntry.ipLiteral;

            if (!ip.includes("/")) {
                ip += "/0";
            }

            setUpdatedBlacklistEntry({
                ...updatedBlacklistEntry,
                ipLiteral: null,
                ipRange: ip,
            });

        } else {
            let ip = updatedBlacklistEntry.ipRange;

            if (ip.includes("/")) {
                ip = ip.split("/", 1)[0];
            }

            setUpdatedBlacklistEntry({
                ...updatedBlacklistEntry,
                ipLiteral: ip,
                ipRange: null,
            });
        }

        setIpLiteralFlag(!ipLiteralFlag);
    };

    const togglePathLiteralRegex = () => {
        if (pathLiteralFlag) {
            let path = updatedBlacklistEntry.pathLiteral;

            setUpdatedBlacklistEntry({
                ...updatedBlacklistEntry,
                pathLiteral: null,
                pathRegex: path,
            });

        } else {
            let path = updatedBlacklistEntry.pathRegex;

            setUpdatedBlacklistEntry({
                ...updatedBlacklistEntry,
                pathLiteral: path,
                pathRegex: null,
            });
        }

        setPathLiteralFlag(!pathLiteralFlag);
    };

    const getIpInput = () => {
        const field = ipLiteralFlag ? "ipLiteral" : "ipRange";

        return (
            <>
                <FormControl
                    label="IP Address"
                    key={"form-control-ip-address"}
                    error={
                        blacklistEntryErrors[field]
                            ? `IP Address ${blacklistEntryErrors[field]}`
                            : ""
                    }
                >
                    <Input
                        id={"input-ip"}
                        value={updatedBlacklistEntry[field] || ""}
                        onChange={event =>
                            setValue(field, event.currentTarget.value)
                        }
                        error={blacklistEntryErrors[field]}
                    />
                </FormControl>
                <Checkbox
                    checked={!ipLiteralFlag}
                    onChange={toggleIpLiteralRange}
                    checkmarkType={STYLE_TYPE.toggle_round}
                    overrides={{
                        Label: {
                            style: ({ $theme }) => {
                                return { fontSize: $theme.sizing.scale400 };
                            }
                        }
                    }}
                >
                    Allow IP Range
                </Checkbox>
            </>
        );
    };

    const getPathInput = () => {
        const field = pathLiteralFlag ? "pathLiteral" : "pathRegex";

        return (
            <>
                <FormControl
                    label="Request Path"
                    key={"form-control-path"}
                    error={
                        blacklistEntryErrors[field]
                            ? `IP Address ${blacklistEntryErrors[field]}`
                            : ""
                    }
                >
                    <Input
                        id={"input-path"}
                        value={updatedBlacklistEntry[field] || ""}
                        onChange={event =>
                            setValue(field, event.currentTarget.value)
                        }
                        error={blacklistEntryErrors[field]}
                    />
                </FormControl>
                <Checkbox
                    checked={!pathLiteralFlag}
                    onChange={togglePathLiteralRegex}
                    checkmarkType={STYLE_TYPE.toggle_round}
                    overrides={{
                        Label: {
                            style: ({ $theme }) => {
                                return { fontSize: $theme.sizing.scale400 };
                            }
                        }
                    }}
                >
                    Use Regex
                </Checkbox>
            </>
        );
    };

    return (
        <Page
            title={blankBlacklistEntry
                ? "New Blacklist Entry | Settings | Open Interop"
                : "Edit Blacklist Entry | Settings | Open Interop"
            }
            heading={blankBlacklistEntry ? "Create Blacklist Entry" : "Edit Blacklist Entry"}
            backlink={allBlacklistEntriesPath}
            actions={
                <>
                    {blankBlacklistEntry ? null : (
                        <ConfirmModal
                            buttonText="Delete"
                            title="Confirm Deletion"
                            mainText={
                                <>
                                    <div>
                                        Are you sure you want to
                                        delete this Blacklist Entry?
                                    </div>
                                    <div>
                                        This action can't be undone.
                                    </div>
                                </>
                            }
                            primaryAction={deleteBlacklistEntry}
                            primaryActionText="Delete"
                            secondaryActionText="Cancel"
                        />
                    )}
                    <Button
                        onClick={saveBlacklistEntry}
                        disabled={identicalObject(
                            blacklistEntry,
                            updatedBlacklistEntry,
                        )}
                        aria-label={
                            blankBlacklistEntry
                                ? "Create blacklistEntry"
                                : "Update blacklistEntry"
                        }
                    >
                        {blankBlacklistEntry ? "Create" : "Save"}
                    </Button>
                </>
            }
        >
            <DataProvider
                getData={() => {
                    return getBlacklistEntry().then(response => {
                        setBlacklistEntry(response);
                        setUpdatedBlacklistEntry(response);
                        setIpLiteralFlag(!response.ipRange);
                        setPathLiteralFlag(!response.pathRegex);
                    });
                }}
                renderData={() => (
                    <>
                        {getIpInput()}
                        {getPathInput()}
                        <FormControl
                            label="Headers"
                            key={"form-control-headers"}
                            error={
                                blacklistEntryErrors.pathRegex
                                    ? `Headers ${blacklistEntryErrors.headers}`
                                    : ""
                            }
                        >
                            <PairInput
                                data={updatedBlacklistEntry.headers || {}}
                                updateData={data => setValue("headers", data)}
                            />
                        </FormControl>
                    </>
                )}
            />
        </Page>
    );
};

export { BlacklistEntry };
