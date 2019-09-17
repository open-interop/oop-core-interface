import React, { useState } from "react";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import api from "../../APIservice";

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
                        value={email}
                        onChange={event => setEmail(event.currentTarget.value)}
                        placeholder="E-mail address"
                    />
                </FormControl>
                <FormControl>
                    <Input
                        id="input-password"
                        value={password}
                        onChange={event =>
                            setPassword(event.currentTarget.value)
                        }
                        placeholder="Password"
                    />
                </FormControl>
                <Button
                    onClick={() => {
                        setLoading(true);
                        setErrorMessage("");
                        api.login(email, password).catch(error => {
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
