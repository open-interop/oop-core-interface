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
import OopCore from "../../OopCore";

const Header = props => (
    <div className="header">
        <HeaderNavigation>
            <NavigationList $align={ALIGN.right}>
                <NavigationItem>
                    <StyledLink href="#">Dan User</StyledLink>
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

export { Header };
