import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";

import { Page } from "../Universal";

const Profile = props => {
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Page
            title="User Profile | Open Interop"
            heading="Current User Profile"
            actions={
                <Button
                    $as={Link}
                    to={`/users/${props.user.id}`}
                    aria-label="Edit current user profile"
                >
                    Edit
                </Button>
            }
        >
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
        </Page>
    );
};

export default Profile;
