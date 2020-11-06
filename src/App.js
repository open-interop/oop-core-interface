import React, { Component } from "react";

import { BaseProvider } from "baseui";
import { Block } from 'baseui/block';
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import oopTheme from "./theme";

import { BrowserRouter, Route, Redirect, withRouter, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import {
    AuditLog,
    AuditLogs,
    BlacklistEntries,
    BlacklistEntry,
    Dashboard,
    Device,
    DeviceDashboard,
    DeviceGroup,
    DeviceGroups,
    Devices,
    ForgotPassword,
    Header,
    Login,
    ResetPassword,
    Profile,
    Schedules,
    Schedule,
    ScheduleDashboard,
    Layers,
    Layer,
    Message,
    Messages,
    MobileHeader,
    MobileNavigation,
    PageNotFound,
    SideNavigation,
    Site,
    Sites,
    Tempr,
    Temprs,
    TemprMap,
    Transmission,
    Transmissions,
    User,
    Users,
} from "./components/View";
import { GifSpinner } from "./components/Universal";
import OopCore from "./OopCore";
import "./styles/App.scss";
import { QueryParamProvider } from "use-query-params";

const engine = new Styletron();
const queryString = require("query-string");

class App extends Component {
    constructor(props) {
        super(props);

        this.history = createBrowserHistory();

        this.state = {
            isLoading: true,
            user: false,
            site: null,
            timeRange: OopCore.getCurrentTimeRange(),
        };

        OopCore.getLoggedInUser().catch(() => this.setNoUser());

        OopCore.on("loggedin", user => this.setUser(user));
        OopCore.on("loggedout", () => this.setNoUser());
    }

    componentDidMount() {
        OopCore.getLoggedInUser().catch(() => this.setNoUser());
        OopCore.getCurrentSite()
            .then(result => {
                this.setState({ site: result });
            })
            .catch(() => this.setState({ site: null }));
    }

    setUser = user => {
        return this.setState({ isLoading: false, user: user });
    };

    setNoUser = () => {
        return this.setState({ isLoading: false, user: false });
    };

    selectSite = site => {
        this.setState({ site: site });
        return OopCore.selectSite(site);
    };

    selectTimeRange = timeRange => {
        this.setState({ timeRange: timeRange });
        return OopCore.selectTimeRange(timeRange);
    };

    HeaderWithRouter = withRouter(Header);

    SideNavigationWithRouter = withRouter(SideNavigation);

    MobileHeaderWithRouter = withRouter(MobileHeader);

    MobileNavigationWithRouter = withRouter(MobileNavigation);

    getComponent = (shouldRedirect, Component, props) => {
        const currentPath = props.match.url;

        return shouldRedirect ? (
            <Redirect
                to={{
                    pathname:
                        currentPath === "/login"
                            ? queryString.parse(props.location.search).redirect
                            : "/login",
                    search:
                        currentPath === "/login" || currentPath === "/"
                            ? ""
                            : `?redirect=${currentPath}`,
                }}
            />
        ) : currentPath === "/login" ||
          currentPath === "/forgot-password" ||
          currentPath === "/reset-password" ? (
            <div className="login">
                <Component {...props} />
            </div>
        ) : (
            <>
                <Block display={['none', 'none', 'block']}>
                    <div className="content">
                        <Component {...props} />
                    </div>
                </Block>
                <Block display={['block', 'block', 'none']}>
                    <div className="content-mobile">
                        <Component {...props} />
                    </div>
                </Block>
            </>
        );
    };

    renderRoutes = () => {
        const hasUser = this.state.user;

        return (
            <BrowserRouter basename={process.env.REACT_APP_BASE_PATH}>
                <QueryParamProvider ReactRouterRoute={Route}>
                    {hasUser && (
                        <>
                            <Block display={['none', 'none', 'block']}>
                                <this.HeaderWithRouter
                                    user={this.state.user}
                                    site={this.state.site}
                                    selectSite={this.selectSite}
                                />
                                <this.SideNavigationWithRouter 
                                    selectSite={this.selectSite} 
                                    site={this.state.site} 
                                    user={this.state.user} />
                            </Block>
                            <Block display={['block', 'block', 'none']}>
                                <this.MobileHeaderWithRouter
                                    user={this.state.user}
                                    site={this.state.site}
                                    selectSite={this.selectSite}
                                />
                                <this.MobileNavigationWithRouter 
                                    selectSite={this.selectSite} 
                                    site={this.state.site} 
                                    user={this.state.user} />
                            </Block>
                        </>
                    )}
                    <Switch>
                        <Route
                            path="/login"
                            exact
                            render={props =>
                                this.getComponent(hasUser, Login, props)
                            }
                        />
                        <Route
                            path="/forgot-password"
                            exact
                            render={props =>
                                this.getComponent(hasUser, ForgotPassword, props)
                            }
                        />
                        <Route
                            path="/reset-password"
                            exact
                            render={props =>
                                this.getComponent(hasUser, ResetPassword, props)
                            }
                        />
                        <Route
                            path="/"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, Dashboard, {
                                    ...props,
                                    site: this.state.site,
                                    selectSite: this.selectSite,
                                    dateFrom: this.state.timeRange,
                                    setDateFrom: this.selectTimeRange,
                                })
                            }
                        />
                        <Route
                            path="/devices"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, Devices, {
                                    ...props,
                                    site: this.state.site,
                                    selectSite: this.selectSite,
                                })
                            }
                        />
                        <Route
                            path="/devices/:deviceId"
                            exact
                            render={props =>
                                this.getComponent(
                                    !hasUser,
                                    props.match.params.deviceId === "new"
                                        ? Device
                                        : DeviceDashboard,
                                    props,
                                )
                            }
                        />
                        <Route
                            path="/devices/:deviceId/edit"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, Device, props)
                            }
                        />
                        <Route
                            path="/transmissions"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, Transmissions, props)
                            }
                        />
                        <Route
                            path="/transmissions/:transmissionId"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, Transmission, props)
                            }
                        />
                        <Route
                            path="/device-groups"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, DeviceGroups, props)
                            }
                        />
                        <Route
                            path="/device-groups/:deviceGroupId"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, DeviceGroup, props)
                            }
                        />
                        <Route
                            path="/temprs"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, Temprs, props)
                            }
                        />
                        <Route
                            path="/temprs/:temprId/map"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, TemprMap, props)
                            }
                        />
                        <Route
                            path="/schedules"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, Schedules, props)
                            }
                        />
                        <Route
                            path="/schedules/:scheduleId"
                            exact
                            render={props =>
                                this.getComponent(
                                    !hasUser,
                                    props.match.params.scheduleId === "new"
                                        ? Schedule
                                        : ScheduleDashboard,
                                    props,
                                )
                            }
                        />
                        <Route
                            path="/schedules/:scheduleId/edit"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, Schedule, props)
                            }
                        />
                        <Route
                            path="/layers"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, Layers, props)
                            }
                        />
                        <Route
                            path="/layers/:layerId"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, Layer, props)
                            }
                        />
                        <Route
                            path="/blacklist-entries"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, BlacklistEntries, props)
                            }
                        />
                        <Route
                            path="/blacklist-entries/:blacklistEntryId"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, BlacklistEntry, props)
                            }
                        />
                        <Route
                            path="/temprs/:temprId"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, Tempr, props)
                            }
                        />
                        <Route
                            path="/users"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, Users, props)
                            }
                        />
                        <Route
                            path="/users/:userId"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, User, props)
                            }
                        />
                        <Route
                            path="/profile"
                            exact
                            render={props => {
                                const user = this.state.user;

                                return this.getComponent(!hasUser, Profile, {
                                    ...props,
                                    user,
                                });
                            }}
                        />
                        <Route
                            path="/sites"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, Sites, props)
                            }
                        />
                        <Route
                            path="/sites/:siteId"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, Site, props)
                            }
                        />
                        <Route
                            path="/messages"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, Messages, props)
                            }
                        />
                        <Route
                            path="/messages/:messageId"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, Message, props)
                            }
                        />
                        <Route
                            path="/:componentType/:componentId/audit-logs"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, AuditLogs, props)
                            }
                        />
                        <Route
                            path="/:componentType/:componentId/audit-logs/:auditLogId"
                            exact
                            render={props =>
                                this.getComponent(!hasUser, AuditLog, props)
                            }
                        />
                        <Route
                            render={props => 
                                this.getComponent(!hasUser, PageNotFound, props)
                            }
                        />
                    </Switch>
                </QueryParamProvider>
            </BrowserRouter>
        );
    };

    render() {
        return <StyletronProvider value={engine}>
            <BaseProvider theme={oopTheme}>
                { this.state.isLoading
                    ? <GifSpinner />
                    : this.renderRoutes()
                }
            </BaseProvider>
        </StyletronProvider>;
    }
}

export default App;
