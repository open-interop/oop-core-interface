import React from "react";
import { Link } from "react-router-dom";
import { Button, KIND } from "baseui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import {
    HeaderNavigation,
    ALIGN,
    StyledNavigationItem as NavigationItem,
    StyledNavigationList as NavigationList,
} from "baseui/header-navigation";
import logo from "../../resources/open-interop-white.svg";
import OopCore from "../../OopCore";

const MobileHeader = props => {
    return (
        <div className="mobile-header">
            <HeaderNavigation>
                <NavigationList $align={ALIGN.left}>
                    <NavigationItem>
                        <a href="/">
                            <img src={logo} alt="logo"/>
                        </a>
                    </NavigationItem>
                    <NavigationItem>
                        <p>All Sites</p>
                    </NavigationItem>
                </NavigationList>
                <NavigationList $align={ALIGN.right}>
                    <NavigationItem>
                        <Button
                            kind={KIND.tertiary}
                            $as={Link}
                            to={"/"}
                            onClick={() => {
                                OopCore.logout();
                            }}
                            aria-label="Log out"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </Button>
                    </NavigationItem>
                </NavigationList>
            </HeaderNavigation>
        </div>
    );
};

export { MobileHeader };
