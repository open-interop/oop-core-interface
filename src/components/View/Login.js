import React, { useState } from "react";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { LineWrapper } from "../Universal";
import logo from "../../resources/open_interop_logo_wide.png";
import OopCore from "../../OopCore";

const Login = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    function handleSubmit() {
        setLoading(true);
        setErrorMessage("");
        OopCore.login(email, password).catch(error => {
            setErrorMessage(error.message);
            setLoading(false);
        });
    }

    return (
        <>
            <div className="login-form">
                <img src={logo} alt="logo" />
                <LineWrapper title="Sign in">
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
                    <Button type="submit" onClick={handleSubmit}>
                        login
                    </Button>
                    <div> {errorMessage && "Error: " + errorMessage}</div>
                    <div> {loading && "loading"}</div>
                </LineWrapper>
            </div>
        </>
    );
};

export { Login };
