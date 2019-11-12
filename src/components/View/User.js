import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, KIND } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Select } from "baseui/select";
import { DataProvider } from "../Universal";
import { Timezones } from "../../resources/Timezones";
import { clearToast, ErrorToast, SuccessToast } from "../Global";
import { identicalObject } from "../../Utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import OopCore from "../../OopCore";

const User = props => {
    const [user, setUser] = useState({});
    const [updatedUser, setUpdatedUser] = useState({});
    const [userErrors, setUserErrors] = useState({});
    const blankUser = props.match.params.userId === "new";
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
                  timeZone: "",
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

    const passwordMismatch = () => {
        return (
            updatedUser.passwordConfirmation &&
            updatedUser.password !== updatedUser.passwordConfirmation &&
            "The passwords do not match"
        );
    };

    const passwordTooShort = password => {
        return (
            password && password.length < 6 && "Minimum length is 6 characters"
        );
    };

    return (
        <div className="content-wrapper">
            <div className="flex-left">
                <Button
                    $as={Link}
                    kind={KIND.minimal}
                    to={allUsersPath}
                    aria-label="Go back to all users"
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
                <h2>{blankUser ? "Create User" : "Edit User"}</h2>
            </div>
            <DataProvider
                getData={() => {
                    return getUser().then(response => {
                        setUser(response);
                        setUpdatedUser(response);
                    });
                }}
                renderData={() => (
                    <>
                        <FormControl
                            label="Email"
                            key={"form-control-group-email"}
                            error={
                                userErrors.email
                                    ? `Email ${userErrors.email}`
                                    : ""
                            }
                        >
                            <Input
                                id={"input-email"}
                                value={updatedUser.email || ""}
                                onChange={event =>
                                    setValue("email", event.currentTarget.value)
                                }
                                error={userErrors.email}
                            />
                        </FormControl>
                        <FormControl
                            label={blankUser ? "Password" : "New password"}
                            key={"form-control-group-new-password"}
                            error={
                                userErrors.password
                                    ? `Password ${userErrors.password}`
                                    : passwordTooShort(updatedUser.password)
                            }
                        >
                            <Input
                                type="password"
                                id={"input-new-password"}
                                value={updatedUser.password || ""}
                                onChange={event =>
                                    setValue(
                                        "password",
                                        event.currentTarget.value,
                                    )
                                }
                                error={userErrors.password}
                            />
                        </FormControl>
                        <FormControl
                            label="Confirm password"
                            key={"form-control-group-confirm-password"}
                            error={
                                userErrors.passwordConfirmation
                                    ? `Password confirmation ${userErrors.passwordConfirmation}`
                                    : passwordTooShort(
                                          updatedUser.passwordConfirmation,
                                      ) || passwordMismatch()
                            }
                        >
                            <Input
                                type="password"
                                id={"input-confirm-password"}
                                value={updatedUser.passwordConfirmation || ""}
                                onChange={event =>
                                    setValue(
                                        "passwordConfirmation",
                                        event.currentTarget.value,
                                    )
                                }
                                error={userErrors.passwordConfirmation}
                            />
                        </FormControl>
                        <FormControl
                            label="Timezone"
                            key={`form-control-timezone`}
                            error={
                                userErrors.timeZone
                                    ? `Time zone  ${userErrors.timeZone}`
                                    : ""
                            }
                        >
                            <Select
                                id="select-id"
                                options={timezones}
                                labelKey="name"
                                valueKey="id"
                                searchable={true}
                                onChange={event => {
                                    event.value.length
                                        ? setValue(
                                              "timeZone",
                                              event.value[0].id,
                                          )
                                        : setValue("timeZone", null);
                                }}
                                value={timezones.filter(
                                    item => item.id === updatedUser.timeZone,
                                )}
                                error={userErrors.timeZone}
                            />
                        </FormControl>

                        <Button
                            onClick={() => {
                                clearToast();
                                setUserErrors({});
                                if (blankUser) {
                                    return OopCore.createUser(updatedUser)
                                        .then(response => {
                                            SuccessToast(
                                                "Created new user",
                                                "Success",
                                            );
                                            refreshUser(response);
                                            props.history.replace(
                                                `${allUsersPath}/${response.id}`,
                                            );
                                        })
                                        .catch(error => {
                                            setUserErrors(error);
                                            ErrorToast(
                                                "Failed to create user",
                                                "Error",
                                            );
                                        });
                                } else {
                                    return OopCore.updateUser(
                                        props.match.params.userId,
                                        updatedUser,
                                    )
                                        .then(response => {
                                            refreshUser(response);
                                            SuccessToast(
                                                "Updated user",
                                                "Success",
                                            );
                                        })
                                        .catch(error => {
                                            setUserErrors(error);
                                            ErrorToast(
                                                "Failed to update user",
                                                "Error",
                                            );
                                        });
                                }
                            }}
                            disabled={identicalObject(user, updatedUser)}
                        >
                            {blankUser ? "Create" : "Save"}
                        </Button>
                    </>
                )}
            />
        </div>
    );
};

export { User };
