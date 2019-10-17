import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Select } from "baseui/select";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import ArrowLeft from "baseui/icon/arrow-left";
import { DataProvider, Error } from "../Universal";
import { HttpTemprTemplate } from "../Global";
import OopCore from "../../OopCore";

const User = props => {
    const [user, setUser] = useState({});
    const [updatedUser, setUpdatedUser] = useState({});
    const blankUser = props.match.params.userId === "new";
    const [error, setError] = useState("");

    const getUser = () => {
        return blankUser
            ? Promise.resolve({
                  id: "",
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

    const saveButtonDisabled = () => {
        if (blankUser) {
            return false;
        } else {
            return identical(user, updatedUser);
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
                                disabled
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
