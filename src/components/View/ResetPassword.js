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
    const [errorMessage, setErrorMessage] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordconfirmation] = useState("");
    const handleSubmit = () => {
        setLoading(true);
        setErrorMessage("");
        OopCore.resetPassword(token, password, passwordConfirmation)
            .then(() => props.history.replace(`/login`))
            .catch(error => {
                setErrorMessage(error.message);
                setLoading(false);
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
                <FormControl>
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
                    className="login-button"
                    onClick={handleSubmit}
                    aria-label="Submit new password"
                >
                    Submit
                </Button>
                <div>
                    <Error message={errorMessage} />
                </div>
                <div> {loading && "loading"}</div>
            </LineWrapper>
        </div>
    );
};

export { ResetPassword };
