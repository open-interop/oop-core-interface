import * as React from "react";
import { Button } from "baseui/button";
import {
    HeaderNavigation,
    ALIGN,
    StyledNavigationItem as NavigationItem,
    StyledNavigationList as NavigationList,
} from "baseui/header-navigation";
import { StyledLink as Link } from "baseui/link";
import OopCore from "../../OopCore";

const Header = props => (
    <div className="header">
        <HeaderNavigation>
            <NavigationList $align={ALIGN.right}>
                <NavigationItem>
                    <Link href="#">Dan User</Link>
                </NavigationItem>
                <NavigationItem>
                    <Button
                        onClick={() => {
                            OopCore.logout();
                            props.history.push("/");
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
