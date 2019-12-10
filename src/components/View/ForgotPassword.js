import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Error, LineWrapper } from "../Universal";
import logo from "../../resources/open-interop-white.svg";
import OopCore from "../../OopCore";

const ForgotPassword = () => {
    useEffect(() => {
        document.title = "Password Reset | Open Interop";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [user, setUser] = React.useState("");

    const handleSubmit = () => {
        setLoading(true);
        setSubmitted(false);
        setErrorMessage("");
        OopCore.requestPasswordReset(user)
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
                        <div className="forgot-password-text">
                            Enter your email address and we'll send you a link
                            to reset your password
                        </div>

                        <Button
                            type="submit"
                            className="login-button"
                            onClick={handleSubmit}
                            aria-label="Submit"
                        >
                            Submit
                        </Button>
                        <div className="reset-link">
                            <Link
                                className="reset-link"
                                to={"/login"}
                                aria-label="Go back to login"
                            >
                                Go back
                            </Link>
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
                            <Button
                                $as={Link}
                                to={"/login"}
                                aria-label="Go to login"
                            >
                                Login
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
    }
};

export { ForgotPassword };
