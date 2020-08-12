import React, { useState, useEffect } from "react";

import { Error, LineWrapper, MaxCard } from "../Universal";

import { useStyletron } from "baseui";
import { StyledTitle } from "baseui/card";

const PageNotFound = props => {
    useEffect(() => {
        document.title = "Page Not Found | Open Interop";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    
    return (
        <MaxCard title={
            <StyledTitle>
                Page not found
            </StyledTitle>
        } >
            <div>
                <h3>We're sorry, we couldn't find the page you requested</h3>
                <p>Try heading <a href='/'><u>home</u></a>.</p>
                <p>Or check the <a href='https://docs.openinterop.org/'><u>docs</u></a> for what you were looking for.</p>
            </div>
        </MaxCard>
    );
};

export { PageNotFound };