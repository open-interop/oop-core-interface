import React, { useState } from "react";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import OopCore from "../../OopCore";

const Login = props => {
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    return (
        <>
            <div>
                <FormControl>
                    <Input
                        id="input-email"
                        type="text"
                        autoComplete="email"
                        value={email}
                        onChange={event => setEmail(event.currentTarget.value)}
                        placeholder="E-mail address"
                    />
                </FormControl>
                <FormControl>
                    <Input
                        id="input-password"
                        type="password"
                        autoComplete="password"
                        value={password}
                        onChange={event =>
                            setPassword(event.currentTarget.value)
                        }
                        placeholder="Password"
                    />
                </FormControl>
                <Button
                    type="submit"
                    onClick={e => {
                        e.preventDefault();
                        setLoading(true);
                        setErrorMessage("");
                        OopCore.login(email, password).catch(error => {
                            setErrorMessage(error.message);
                            setLoading(false);
                        });
                    }}
                >
                    login
                </Button>
            </div>
            <div> {errorMessage && "Error: " + errorMessage}</div>
            <div> {loading && "loading"}</div>
        </>
    );
};

export { Login };
