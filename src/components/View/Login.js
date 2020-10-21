import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Error, LineWrapper } from "../Universal";
import logo from "../../resources/open-interop-white.svg";
import OopCore from "../../OopCore";

const Login = () => {
    useEffect(() => {
        document.title = "Login | Open Interop";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleSubmit = () => {
        setLoading(true);
        setErrorMessage("");
        OopCore.login(email, password).catch(error => {
            setErrorMessage(error.message);
            setLoading(false);
        });
    };

    return (
        <>
            <div className="login-form">
                <img src={logo} alt="logo" />
                <LineWrapper title="Login">
                    <FormControl>
                        <Input
                            id="input-email"
                            type="text"
                            autoComplete="email"
                            value={email}
                            onChange={event =>
                                setEmail(event.currentTarget.value)
                            }
                            placeholder="E-mail address"
                        />
                    </FormControl>
                    <FormControl>
                        <Input
                            id="input-password"
                            type="password"
                            autoComplete="password"
                            value={password}
                            onChange={event => {
                                setPassword(event.currentTarget.value);
                            }}
                            onKeyDown={event => {
                                if (event.keyCode === 13) {
                                    handleSubmit();
                                }
                            }}
                            placeholder="Password"
                        />
                    </FormControl>
                    <Button
                        id="login-submit"
                        type="submit"
                        className="submit-button"
                        onClick={handleSubmit}
                        aria-label="Log in"
                    >
                        Log in
                    </Button>
                    <div className="reset-link">
                        <Link
                            className="reset-link"
                            to={"/forgot-password"}
                            aria-label="Forgot password"
                        >
                            Forgotten your password?
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
};

export { Login };
