import * as React from "react";
import {
    HeaderNavigation,
    ALIGN,
    StyledNavigationItem as NavigationItem,
    StyledNavigationList as NavigationList,
} from "baseui/header-navigation";
import { StyledLink as Link } from "baseui/link";
import { Button } from "baseui/button";
import OopCore from "../../OopCore";

const Header = props => (
    <HeaderNavigation>
        <NavigationList $align={ALIGN.left}>
            <NavigationItem>Open Interop</NavigationItem>
        </NavigationList>
        <NavigationList $align={ALIGN.center} />
        <NavigationList $align={ALIGN.right}>
            <NavigationItem>
                <Link href="#">Dan User</Link>
            </NavigationItem>
        </NavigationList>
        <NavigationList $align={ALIGN.right}>
            <NavigationItem>
                <Button
                    onClick={() => {
                        OopCore.logout();
                    }}
                >
                    Log out
                </Button>
            </NavigationItem>
        </NavigationList>
    </HeaderNavigation>
);

export { Header };
