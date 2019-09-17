import React from "react";
import { Header, SideNavigation } from ".";

const ComponentWithNavigation = props => {
    return (
        <>
            <Header />
            <SideNavigation history={props.history} />
            {props.component()}
        </>
    );
};

export { ComponentWithNavigation };
