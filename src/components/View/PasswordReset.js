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
    const [email, setEmail] = React.useState("");

    const handleSubmit = () => {
        setLoading(true);
        setErrorMessage("");
        OopCore.resetPassword(email)
            .then(response => {
                setErrorMessage(response);
                setLoading(false);
            })
            .catch(error => {
                setErrorMessage(error.message);
                setLoading(false);
            });
    };

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
                            value={email}
                            onChange={event =>
                                setEmail(event.currentTarget.value)
                            }
                            placeholder="E-mail address"
                        />
                    </FormControl>
                    <div>
                        Enter your email address and we'll send you a link to
                        reset your password
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
                        {" "}
                        <Error message={errorMessage} />
                    </div>
                    <div> {loading && "loading"}</div>
                </LineWrapper>
            </div>
        </>
    );
};

export { PasswordReset };
