import React from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";

const Profile = props => {
    return (
        <div className="content-wrapper">
            <div className="space-between">
                <h2>Current User Profile</h2>
                <Button $as={Link} to={`/users/${props.user.id}`}>
                    Edit
                </Button>
            </div>
            <FormControl label="Id" key={"form-control-group-id"}>
                <Input id={"input-id"} value={props.user.id} disabled />
            </FormControl>
            <FormControl label="Email" key={"form-control-group-email"}>
                <Input id={"input-email"} value={props.user.email} disabled />
            </FormControl>
            <FormControl
                label="Created At"
                key={"form-control-group-created-at"}
            >
                <Input
                    id={"input-created-at"}
                    value={props.user.createdAt}
                    disabled
                />
            </FormControl>
            <FormControl
                label="Updated At"
                key={"form-control-group-updated-at"}
            >
                <Input
                    id={"input-updated-at"}
                    value={props.user.updatedAt}
                    disabled
                />
            </FormControl>
        </div>
    );
};

export { Profile };
