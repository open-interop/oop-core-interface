import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Select } from "baseui/select";
import ArrowLeft from "baseui/icon/arrow-left";
import { DataProvider, Error } from "../Universal";
import { Timezones } from "./Timezones";
import OopCore from "../../OopCore";

const User = props => {
    const [user, setUser] = useState({});
    const [updatedUser, setUpdatedUser] = useState({});
    const blankUser = props.match.params.userId === "new";
    const [error, setError] = useState("");
    const timezones = Timezones.map(timezone => {
        return {
            id: timezone,
            name: timezone,
        };
    });

    const getUser = () => {
        return blankUser
            ? Promise.resolve({
                  id: "",
                  email: "",
                  time_zone: "",
              })
            : OopCore.getUser(props.match.params.userId);
    };

    const refreshUser = user => {
        setUser(user);
        setUpdatedUser(user);
    };

    const allUsersPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    const setValue = (key, value) => {
        const updatedData = { ...updatedUser };
        updatedData[key] = value;
        setUpdatedUser(updatedData);
    };

    const identical = (oldObject, updatedObject) => {
        return Object.keys(oldObject).every(
            key => oldObject[key] === updatedObject[key],
        );
    };

    const passwordMismatch =
        updatedUser.confirmPassword &&
        updatedUser.newPassword !== updatedUser.confirmPassword &&
        "The passwords do not match";

    const passwordComplete =
        updatedUser.newPassword &&
        updatedUser.confirmPassword &&
        !passwordMismatch;

    const saveButtonDisabled = () => {
        if (blankUser) {
            return (
                !updatedUser.email ||
                !updatedUser.time_zone ||
                !passwordComplete
            );
        } else {
            return identical(user, updatedUser) && !passwordComplete;
        }
    };

    return (
        <div className="content-wrapper">
            <Button $as={Link} to={allUsersPath}>
                <ArrowLeft size={24} />
            </Button>
            <h2>{blankUser ? "Create User" : "Edit User"}</h2>
            <DataProvider
                getData={() => {
                    return getUser().then(response => {
                        setUser(response);
                        setUpdatedUser(response);
                    });
                }}
                renderData={() => (
                    <>
                        {/* <FormControl
                            label="Tempr"
                            key={"form-control-group-tempr"}
                        >
                            <Select
                                options={temprs}
                                labelKey="name"
                                valueKey="id"
                                searchable={false}
                                onChange={event => {
                                    setValue("temprId", event.value[0].id);
                                }}
                                value={temprs.find(
                                    item =>
                                        item.id === updatedDeviceTempr.temprId,
                                )}
                            /> */}
                        {/* </FormControl> */}
                        <FormControl
                            label="Email"
                            key={"form-control-group-email"}
                        >
                            <Input
                                id={"input-email"}
                                value={updatedUser.email || ""}
                                onChange={event =>
                                    setValue("email", event.currentTarget.value)
                                }
                            />
                        </FormControl>
                        <FormControl
                            label={blankUser ? "Password" : "New password"}
                            key={"form-control-group-new-password"}
                            error={
                                updatedUser.newPassword &&
                                updatedUser.newPassword.length < 6 &&
                                "Minimum length is 6 characters"
                            }
                        >
                            <Input
                                type="password"
                                id={"input-new-password"}
                                value={updatedUser.newPassword || ""}
                                onChange={event =>
                                    setValue(
                                        "newPassword",
                                        event.currentTarget.value,
                                    )
                                }
                            />
                        </FormControl>
                        <FormControl
                            label="Confirm password"
                            key={"form-control-group-confirm-password"}
                            error={
                                passwordMismatch ||
                                (updatedUser.confirmPassword &&
                                    updatedUser.confirmPassword.length < 6 &&
                                    "Minimum length is 6 characters")
                            }
                        >
                            <Input
                                type="password"
                                id={"input-confirm-password"}
                                value={updatedUser.confirmPassword || ""}
                                onChange={event =>
                                    setValue(
                                        "confirmPassword",
                                        event.currentTarget.value,
                                    )
                                }
                            />
                        </FormControl>
                        <FormControl
                            label="Timezone"
                            key={`form-control-timezone`}
                        >
                            <Select
                                id="select-id"
                                options={timezones}
                                labelKey="name"
                                valueKey="id"
                                searchable={true}
                                onChange={event =>
                                    setValue("time_zone", event.value[0].id)
                                }
                                value={timezones.find(
                                    item => item.id === updatedUser.time_zone,
                                )}
                            />
                        </FormControl>

                        <Button
                            onClick={() => {
                                setError("");
                                if (blankUser) {
                                    return OopCore.createUser(updatedUser)
                                        .then(response => {
                                            refreshUser(response);
                                            props.history.replace(
                                                `${allUsersPath}/${response.id}`,
                                            );
                                        })
                                        .catch(err => {
                                            console.error(err);
                                            setError(
                                                "Something went wrong while creating the user",
                                            );
                                        });
                                } else {
                                    return OopCore.updateUser(
                                        props.match.params.userId,
                                        updatedUser,
                                    )
                                        .then(response => {
                                            refreshUser(response);
                                        })
                                        .catch(err => {
                                            console.error(err);
                                            setError(
                                                "Something went wrong while saving user details ",
                                            );
                                        });
                                }
                            }}
                            disabled={saveButtonDisabled()}
                        >
                            {blankUser ? "Create" : "Save"}
                        </Button>
                        <Error message={error} />
                    </>
                )}
            />
        </div>
    );
};

export { User };
