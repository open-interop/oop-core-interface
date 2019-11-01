import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { Select } from "baseui/select";
import {
    HeaderNavigation,
    ALIGN,
    StyledNavigationItem as NavigationItem,
    StyledNavigationList as NavigationList,
} from "baseui/header-navigation";
import { StyledLink } from "baseui/link";
import logo from "../../resources/open_interop_logo_wide.png";
import OopCore from "../../OopCore";
import { DataProvider } from "../Universal";

const Header = props => {
    const [sites, setSites] = useState([]);
    const [selectOpen, setSelectOpen] = useState(false);

    const toggleOpen = () => {
        return setSelectOpen(!selectOpen);
    };

    return (
        <div className="header">
            <HeaderNavigation>
                <NavigationList $align={ALIGN.left}>
                    <NavigationItem>
                        <img src={logo} alt="logo" />
                    </NavigationItem>
                    <NavigationItem>
                        <DataProvider
                            getData={() => {
                                return OopCore.getSites().then(response => {
                                    setSites(response.data);
                                    return response;
                                });
                            }}
                            renderKey={selectOpen}
                            renderData={() => (
                                <>
                                    <div className="site-selector">
                                        <Select
                                            options={sites}
                                            labelKey="name"
                                            valueKey="id"
                                            onChange={event => {
                                                event.value.length
                                                    ? props.selectSiteId(
                                                          event.value[0].id,
                                                      )
                                                    : props.selectSiteId(null);
                                            }}
                                            value={sites.filter(
                                                item =>
                                                    item.id === props.siteId,
                                            )}
                                            placeholder="All sites"
                                            onOpen={toggleOpen}
                                        />
                                    </div>
                                </>
                            )}
                        />
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
