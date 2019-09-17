import React, { useState } from "react";
import { Button } from "baseui/button";
import api from "../../APIservice";

const Login = props => {
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <>
            <div>
                <Button
                    onClick={() => {
                        setLoading(true);
                        setErrorMessage("");
                        api.login().catch(error => {
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
