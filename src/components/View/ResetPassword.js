import React, { useState } from "react";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Error, LineWrapper } from "../Universal";
import logo from "../../resources/open-interop-white.svg";
import OopCore from "../../OopCore";
const queryString = require("query-string");

const ResetPassword = props => {
    const token = queryString.parse(props.location.search).token || "";
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordconfirmation] = useState("");
    const handleSubmit = () => {
        setLoading(true);
        setErrors({});
        OopCore.resetPassword(token, password, passwordConfirmation)
            .then(() => props.history.push(`/login`))
            .catch(error => {
                if (typeof error === "string") {
                    const updatedErrors = { ...errors };
                    updatedErrors.generic = error;
                    setErrors(updatedErrors);
                    setLoading(false);
                } else {
                    setErrors(error);
                    setLoading(false);
                }
            });
    };

    return (
        <div className="login-form">
            <img src={logo} alt="logo" />
            <LineWrapper title="Create new password">
                <FormControl>
                    <Input
                        id="input-email"
                        type="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={event =>
                            setPassword(event.currentTarget.value)
                        }
                        placeholder="New Password"
                    />
                </FormControl>
                <FormControl
                    error={
                        errors.passwordConfirmation
                            ? `Password confirmation ${errors.passwordConfirmation}`
                            : ""
                    }
                >
                    <Input
                        id="input-password"
                        type="password"
                        autoComplete="new-password"
                        value={passwordConfirmation}
                        onChange={event => {
                            setPasswordconfirmation(event.currentTarget.value);
                        }}
                        onKeyDown={event => {
                            if (event.keyCode === 13) {
                                handleSubmit();
                            }
                        }}
                        placeholder="Confirm Password"
                    />
                </FormControl>
                <Button
                    type="submit"
                    className="submit-button"
                    onClick={handleSubmit}
                    aria-label="Submit new password"
                >
                    Submit
                </Button>
                <div>
                    <Error message={errors.generic} />
                </div>
                <div> {loading && "loading"}</div>
            </LineWrapper>
        </div>
    );
};

export { ResetPassword };
