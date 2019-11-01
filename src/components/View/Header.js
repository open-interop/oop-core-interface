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
import logo from "../../resources/open-interop-white.svg";
import OopCore from "../../OopCore";
import { DataProvider } from "../Universal";

const Header = props => {
    const [sites, setSites] = useState([]);
    const [children, setChildren] = useState([]);
    const [dropdownStatus, setDropdownStatus] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const toggleDropdownStatus = () => {
        return setDropdownStatus(!dropdownStatus);
    };

    const getSites = () => {
        if (searchValue) {
            return OopCore.getSites({
                name: searchValue,
            });
        } else {
            return OopCore.getSites();
        }
    };

    const selectedSite = sites.filter(item => item.id === props.siteId);

    const getSiteChildren = siteId => {
        return OopCore.getSites({
            siteId: siteId,
        });
    };

    return (
        <div className="header">
            <HeaderNavigation>
                <NavigationList $align={ALIGN.left}>
                    <NavigationItem>
                        <img src={logo} alt="logo" />
                    </NavigationItem>
                    <NavigationItem>
                        <div className="site-selector">
                            <DataProvider
                                getData={() => {
                                    return getSites().then(response => {
                                        setSites(response.data);
                                        return response;
                                    });
                                }}
                                renderKey={dropdownStatus + searchValue}
                                renderData={() => {
                                    return (
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
                                            onInputChange={event =>
                                                setSearchValue(
                                                    event.currentTarget.value,
                                                )
                                            }
                                            value={selectedSite}
                                            placeholder="All sites"
                                            onOpen={toggleDropdownStatus}
                                        />
                                    );
                                }}
                            />
                        </div>
                    </NavigationItem>
                    {selectedSite.length > 0 && (
                        <NavigationItem>
                            <div className="site-selector">
                                <DataProvider
                                    getData={() => {
                                        return getSiteChildren(
                                            selectedSite.id,
                                        ).then(response => {
                                            setChildren(response.data);
                                            return response;
                                        });
                                    }}
                                    renderKey={dropdownStatus + searchValue}
                                    allowUpdate={selectedSite}
                                    renderData={() => {
                                        if (children.length) {
                                            return (
                                                <Select
                                                    options={children}
                                                    labelKey="name"
                                                    valueKey="id"
                                                    onChange={event => {
                                                        event.value.length
                                                            ? props.selectSiteId(
                                                                  event.value[0]
                                                                      .id,
                                                              )
                                                            : props.selectSiteId(
                                                                  null,
                                                              );
                                                    }}
                                                    onInputChange={event =>
                                                        setSearchValue(
                                                            event.currentTarget
                                                                .value,
                                                        )
                                                    }
                                                    value={null}
                                                    placeholder="All site children"
                                                    onOpen={
                                                        toggleDropdownStatus
                                                    }
                                                />
                                            );
                                        }
                                    }}
                                />
                            </div>
                        </NavigationItem>
                    )}
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
