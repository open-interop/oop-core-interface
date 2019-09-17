import * as React from "react";
import {
    HeaderNavigation,
    ALIGN,
    StyledNavigationItem as NavigationItem,
    StyledNavigationList as NavigationList,
} from "baseui/header-navigation";
import { StyledLink as Link } from "baseui/link";
import { Button } from "baseui/button";
import api from "../../APIservice";

const Header = () => (
    <HeaderNavigation>
        <NavigationList $align={ALIGN.left}>
            <NavigationItem>OOP</NavigationItem>
        </NavigationList>
        <NavigationList $align={ALIGN.center} />
        <NavigationList $align={ALIGN.right}>
            <NavigationItem>
                <Link href="#basic-link1">Tab Link One</Link>
            </NavigationItem>
            <NavigationItem>
                <Link href="#basic-link2">Tab Link Two</Link>
            </NavigationItem>
        </NavigationList>
        <NavigationList $align={ALIGN.right}>
            <NavigationItem>
                <Button onClick={() => api.logout()}>logout</Button>
            </NavigationItem>
        </NavigationList>
    </HeaderNavigation>
);

export { Header };
