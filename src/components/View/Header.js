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
import { StyledLink } from "baseui/link";
import { SiteSelector } from "../Global";
import logo from "../../resources/open-interop-white.svg";
import OopCore from "../../OopCore";

const Header = props => {
    return (
        <div className="header">
            <HeaderNavigation>
                <NavigationList $align={ALIGN.left}>
                    <NavigationItem>
                        <img src={logo} alt="logo" />
                    </NavigationItem>
                    {!props.history.location.pathname.includes("/sites") &&
                        !props.history.location.pathname.includes("/temprs") &&
                        !props.history.location.pathname.includes("/users") &&
                        !props.history.location.pathname.includes("/device-groups") && (
                            <SiteSelector
                                selectedSite={props.site}
                                selectSite={props.selectSite}
                                wrapper={NavigationItem}
                            />
                        )}
                </NavigationList>
                <NavigationList $align={ALIGN.right}>
                    <NavigationItem>
                        <StyledLink $as={Link} to={"/profile"} $style={{ textDecoration: "none" }}>
                            {props.user.email}
                        </StyledLink>
                    </NavigationItem>
                    <NavigationItem>
                        <Button
                            kind={KIND.tertiary}
                            $as={Link}
                            to={"/"}
                            onClick={() => {
                                OopCore.logout();
                            }}
                            aria-label="Log out"
                            endEnhancer={() => <FontAwesomeIcon icon={faSignOutAlt} />}
                        >
                            Log out
                        </Button>
                    </NavigationItem>
                </NavigationList>
            </HeaderNavigation>
        </div>
    );
};

export { Header };
