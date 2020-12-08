import React, { useEffect } from "react";

import { MaxCard } from "../Universal";

import { StyledTitle } from "baseui/card";

const PageNotFound = props => {
    useEffect(() => {
        document.title = props.item ? props.item + " Not Found | Open Interop" : "Page Not Found | Open Interop";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <MaxCard title={
            <StyledTitle>
                {props.item ? `${props.item} Not Found` : 'Page not found'}
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

export default PageNotFound;
