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
import { Timezones, TimeDiff } from "../../resources/Timezones";

const Account = props => {
    const [account, setAccount] = useState({});
    const [updatedAccount, setUpdatedAccount] = useState({});
    const [accountErrors, setAccountErrors] = useState({});
    const blankAccount = props.match.params.accountId === "new";

    const getAccount = () => {
        return blankAccount
            ? Promise.resolve({
                  hostname: "",
              })
            : OopCore.getAccount(props.match.params.accountId);
    };

    const refreshAccount = acc => {
        setAccount(acc);
        setUpdatedAccount(acc);
    };

    const allAccountsPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    const setValue = (key, value) => {
        const updatedData = { ...updatedAccount };
        updatedData[key] = value;
        setUpdatedAccount(updatedData);
    };

    const getData = () => {
        return Promise.resolve(getAccount()
        ).then(acc => {
            return acc;
        });
    };

    const deleteAccount = () => {
        return OopCore.deleteAccount(updatedAccount.id)
            .then(() => {
                props.history.replace(`/accounts`);
                SuccessToast("Deleted account", "Success");
            })
            .catch(error => {
                console.error(error);
                ErrorToast("Could not delete account", "Error");
            });
    };

    const saveAccount = () => {
        clearToast();
        setAccountErrors({});
        return OopCore.updateAccount(props.match.params.accountId, updatedAccount)
            .then(response => {
                SuccessToast("Updated account", "Success");
                refreshAccount(response);
            })
            .catch(error => {
                setAccountErrors(error);
                ErrorToast("Failed to update account", "Error");
            });
    };

    return (
        <Page
            title={
                blankAccount
                    ? "New Account | Settings | Open Interop"
                    : "Edit Account | Settings | Open Interop"
            }
            heading={blankAccount ? "Create Account" : "Edit Account"}
            actions={
                <>
                    {blankAccount ? null : (
                        <Button
                            $as={Link}
                            to={`${props.location.pathname}/audit-logs`}
                            aria-label={"History"}
                        >
                            History
                        </Button>
                    )}
                    {blankAccount ? null : (
                        <ConfirmModal
                            buttonText="Delete"
                            title="Confirm Deletion"
                            mainText={
                                <>
                                    <div>
                                        Are you sure you want to
                                        delete this account?
                                    </div>
                                    <div>
                                        This action can't be undone.
                                    </div>
                                </>
                            }
                            primaryAction={deleteAccount}
                            primaryActionText="Delete"
                            secondaryActionText="Cancel"
                        />
                    )}
                    <Button
                        onClick={saveAccount}
                        disabled={identicalObject(
                            account,
                            updatedAccount,
                        )}
                        aria-label={
                            blankAccount
                                ? "Create account"
                                : "Update account"
                        }
                    >
                        {blankAccount ? "Create" : "Save"}
                    </Button>
                </>
            }
            backlink={allAccountsPath}
        >
            <DataProvider
                getData={() => {
                    return getData().then(response => refreshAccount(response));
                }}
                renderData={() => (
                    <>
                        <FormControl
                            label="Hostname"
                            key={"form-control-group-host-name"}
                            error={
                                accountErrors.hostname ? `Hostname ${accountErrors.hostname}` : ""
                            }
                            caption="required"
                        >
                            <Input
                                id={"input-hostname"}
                                value={updatedAccount.hostname || ""}
                                onChange={event =>
                                    setValue("hostname", event.currentTarget.value)
                                }
                                error={accountErrors.hostname}
                            />
                        </FormControl>
                    </>
                )}
            />
        </Page>
    );
};

export default Account;
