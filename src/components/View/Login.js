import React from "react";
import { Button } from "baseui/button";
import api from "../../APIservice";

const Login = props => {
    return (
        <>
            <div>
                This is the login page. Once you click login you will be
                redirected to {props.nextPath || "/"}
            </div>
            <div>
                <Button onClick={() => api.login()}>login</Button>
            </div>
        </>
    );
};

export { Login };
