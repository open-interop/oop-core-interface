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

import { useStyletron } from "baseui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const Account = props => {
    const [account, setAccount] = useState({});
    const [updatedAccount, setUpdatedAccount] = useState({});
    const [accountErrors, setAccountErrors] = useState({});
    const blankAccount = props.match.params.accountId === "new";

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
        return Promise.resolve(
                    OopCore.getAccount()
                ).then(acc => {
                    return acc;
                });
    };

    const saveAccount = () => {
        clearToast();
        setAccountErrors({});
        return OopCore.updateAccount(updatedAccount)
            .then(response => {
                SuccessToast("Updated account", "Success");
                refreshAccount(response);
            })
            .catch(error => {
                setAccountErrors(error);
                ErrorToast("Failed to update account", "Error");
            });
    };


    const StatusIndicator = props => {
        const accActive = props;

        const [css, theme] = useStyletron();

        const active = css({
            float: "right",
            color: theme.colors.positive,
            fontSize: "large",
            ":after": { content: '" ACTIVE"' },
        });

        const inactive = css({
            float: "right",
            color: theme.colors.negative,
            fontSize: "large",
            ":after": { content: '" INACTIVE"' },
        });

        return (
            <span className={accActive ? active : inactive}>
                <FontAwesomeIcon
                    className={accActive ? "blink" : ""}
                    icon={faCircle}
                />
            </span>
        );
    };

    return (
        <Page
            title={"Edit Account | Settings | Open Interop"}
            heading={"Edit Account"}
            actions={
                <>
                    <Button
                        $as={Link}
                        to={`${props.location.pathname}/audit-logs`}
                        aria-label={"History"}
                    >
                        History
                    </Button>
                    <Button
                        onClick={saveAccount}
                        disabled={identicalObject(
                            account,
                            updatedAccount,
                        )}
                        aria-label={"Update account"}
                    >
                        Save
                    </Button>
                </>
            }
        >
            <DataProvider
                getData={() => {
                    return getData().then(response => refreshAccount(response));
                }}
                renderData={() => (
                    <>
                        <StatusIndicator account={updatedAccount.active} />
                        <FormControl
                            label="Name"
                            key={"form-control-group-name"}
                            error={
                                accountErrors.name ? `Name ${accountErrors.name}` : ""
                            }
                            caption="required"
                        >
                            <Input
                                id={"input-name"}
                                value={updatedAccount.name || ""}
                                onChange={event =>
                                    setValue("name", event.currentTarget.value)
                                }
                                error={accountErrors.name}
                            />
                        </FormControl>
                        <FormControl
                            label="Hostname"
                            key={"form-control-group-host-name"}
                            caption="required"
                        >
                            <Input
                                id={"input-hostname"}
                                value={updatedAccount.hostname || ""}
                                disabled={true}
                            />
                        </FormControl>
                        <FormControl
                            label="Created at"
                            key={"form-control-group-created-at"}
                        >
                            <Input
                                id={"input-created-at"}
                                value={updatedAccount.createdAt || ""}
                                disabled={true}
                            />
                        </FormControl>
                        <FormControl
                            label="Interface Path"
                            key={"form-control-group-path"}
                            caption="required"
                            error={
                                accountErrors.interfacePath ? `Interface Path ${accountErrors.interfacePath}` : ""
                            }
                        >
                            <Input
                                id={"input-path"}
                                value={updatedAccount.interfacePath || ""}
                                onChange={event =>
                                    setValue("interfacePath", event.currentTarget.value)
                                }
                                error={accountErrors.interfacePath}
                            />
                        </FormControl>
                        <FormControl
                            label="Interface Port"
                            key={"form-control-group-port"}
                            caption="required"
                            error={
                                accountErrors.interfacePort ? `Interface Port ${accountErrors.interfacePort}` : ""
                            }
                        >
                            <Input
                                id={"input-port"}
                                value={updatedAccount.interfacePort || ""}
                                onChange={event =>
                                    setValue("interfacePort", event.currentTarget.value)
                                }
                                error={accountErrors.interfacePort}
                            />
                        </FormControl>
                        <FormControl
                            label="Interface Scheme"
                            key={"form-control-group-scheme"}
                            caption="required"
                            error={
                                accountErrors.interfaceScheme ? `Interface Scheme ${accountErrors.interfaceScheme}` : ""
                            }
                        >
                            <Input
                                id={"input-scheme"}
                                value={updatedAccount.interfaceScheme || ""}
                                onChange={event =>
                                    setValue("interfaceScheme", event.currentTarget.value)
                                }
                                error={accountErrors.interfaceScheme}
                            />
                        </FormControl>
                    </>
                )}
            />
        </Page>
    );
};

export default Account;
