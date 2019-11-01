import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Error, LineWrapper } from "../Universal";
import logo from "../../resources/open_interop_logo_wide.png";
import OopCore from "../../OopCore";

const PasswordReset = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [user, setUser] = React.useState("");

    const handleSubmit = () => {
        setLoading(true);
        setSubmitted(false);
        setErrorMessage("");
        OopCore.resetPassword(user)
            .then(() => {
                setErrorMessage("");
                setLoading(false);
                setSubmitted(true);
            })
            .catch(() => {
                setErrorMessage("Could not reset password");
                setLoading(false);
                setSubmitted(false);
            });
    };

    if (!submitted) {
        return (
            <>
                <div className="login-form">
                    <img src={logo} alt="logo" />
                    <LineWrapper title="Forgotten your password?">
                        <FormControl>
                            <Input
                                id="input-email"
                                type="text"
                                autoComplete="email"
                                value={user.email || ""}
                                onChange={event =>
                                    setUser({
                                        email: event.currentTarget.value,
                                    })
                                }
                                placeholder="E-mail address"
                            />
                        </FormControl>
                        <div>
                            Enter your email address and we'll send you a link
                            to reset your password
                        </div>
                        <div className="space-between">
                            <Button type="submit" onClick={handleSubmit}>
                                Submit
                            </Button>
                            <Button $as={Link} to={"/login"}>
                                Go back
                            </Button>
                        </div>
                        <div>
                            <Error message={errorMessage} />
                        </div>
                        <div> {loading && "loading"}</div>
                    </LineWrapper>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="login-form">
                    <img src={logo} alt="logo" />
                    <LineWrapper title="Success!">
                        <div>A password reset link has been emailed to you</div>
                        <div className="space-between">
                            <Button $as={Link} to={"/login"}>
                                Login
                            </Button>
                        </div>
                        <div>
                            {" "}
                            <Error message={errorMessage} />
                        </div>
                        <div> {loading && "loading"}</div>
                    </LineWrapper>
                </div>
            </>
        );
    }
};

export { PasswordReset };
