import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { Heading, HeadingLevel } from "baseui/heading";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";

const Profile = props => {
    useEffect(() => {
        document.title = "User Profile | Open Interop";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="content-wrapper">
            <HeadingLevel>
                <div className="space-between">
                    <Heading>Current User Profile</Heading>
                    <Button
                        $as={Link}
                        to={`/users/${props.user.id}`}
                        aria-label="Edit current user profile"
                    >
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
            </HeadingLevel>
        </div>
    );
};

export { Profile };
