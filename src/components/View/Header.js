import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import {
    HeaderNavigation,
    ALIGN,
    StyledNavigationItem as NavigationItem,
    StyledNavigationList as NavigationList,
} from "baseui/header-navigation";
import { StyledLink } from "baseui/link";
import logo from "../../resources/open_interop_logo_wide.png";
import OopCore from "../../OopCore";

const Header = props => {
    return (
        <div className="header">
            <HeaderNavigation>
                <NavigationList $align={ALIGN.left}>
                    <NavigationItem>
                        <img src={logo} alt="logo" />
                    </NavigationItem>
                </NavigationList>
                <NavigationList $align={ALIGN.right}>
                    <NavigationItem>
                        <StyledLink $as={Link} to={"/profile"}>
                            {props.user.email}
                        </StyledLink>
                    </NavigationItem>
                    <NavigationItem>
                        <Button
                            $as={Link}
                            to={"/"}
                            onClick={() => {
                                OopCore.logout();
                            }}
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
