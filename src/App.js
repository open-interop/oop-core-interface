import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, withRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import {
    Device,
    DeviceGroup,
    DeviceGroups,
    Devices,
    DeviceTempr,
    DeviceTemprs,
    Transmission,
    Transmissions,
    Header,
    Home,
    Login,
    Profile,
    SideNavigation,
    Site,
    Sites,
    Tempr,
    Temprs,
    User,
    Users,
} from "./components/View";
import { Spinner } from "./components/Universal";
import OopCore from "./OopCore";
import "./styles/App.scss";
import { QueryParamProvider } from "use-query-params";
const queryString = require("query-string");

class App extends Component {
    constructor(props) {
        super(props);

        this.history = createBrowserHistory();

        this.state = {
            isLoading: true,
            user: false,
        };

        const setUser = user => {
            return this.setState({ isLoading: false, user: user });
        };

        const setNoUser = () => {
            return this.setState({ isLoading: false, user: false });
        };

        OopCore.getLoggedInUser().catch(() => setNoUser());

        OopCore.on("loggedin", user => setUser(user));
        OopCore.on("loggedout", () => setNoUser());
    }

    HeaderWithRouter = withRouter(Header);

    SideNavigationWithRouter = withRouter(SideNavigation);

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
        ) : currentPath === "/login" ? (
            <div className="login">
                <Component {...props} />
            </div>
        ) : (
            <div className="content">
                <Component {...props} />
            </div>
        );
    };

    renderRoutes = () => {
        const hasUser = this.state.user;

        return (
            <BrowserRouter basename={process.env.REACT_APP_BASE_PATH}>
                <QueryParamProvider ReactRouterRoute={Route}>
                    <Route
                        path="/login"
                        exact
                        render={props =>
                            this.getComponent(hasUser, Login, props)
                        }
                    />
                    {hasUser && (
                        <this.HeaderWithRouter user={this.state.user} />
                    )}
                    {hasUser && <this.SideNavigationWithRouter />}
                    <Route
                        path="/"
                        exact
                        render={props =>
                            this.getComponent(!hasUser, Home, props)
                        }
                    />
                    <Route
                        path="/devices"
                        exact
                        render={props =>
                            this.getComponent(!hasUser, Devices, props)
                        }
                    />
                    <Route
                        path="/devices/:deviceId"
                        exact
                        render={props =>
                            this.getComponent(!hasUser, Device, props)
                        }
                    />
                    <Route
                        path="/devices/:deviceId/transmissions"
                        exact
                        render={props =>
                            this.getComponent(!hasUser, Transmissions, props)
                        }
                    />
                    <Route
                        path="/devices/:deviceId/transmissions/:transmissionId"
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
                        path="/device-groups/:deviceGroupId/temprs"
                        exact
                        render={props =>
                            this.getComponent(!hasUser, Temprs, props)
                        }
                    />
                    <Route
                        path="/device-groups/:deviceGroupId/temprs/:temprId"
                        exact
                        render={props =>
                            this.getComponent(!hasUser, Tempr, props)
                        }
                    />
                    <Route
                        path="/device-groups/:deviceGroupId/device-temprs"
                        exact
                        render={props =>
                            this.getComponent(!hasUser, DeviceTemprs, props)
                        }
                    />{" "}
                    <Route
                        path="/device-groups/:deviceGroupId/device-temprs/:deviceTemprId"
                        exact
                        render={props =>
                            this.getComponent(!hasUser, DeviceTempr, props)
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
                </QueryParamProvider>
            </BrowserRouter>
        );
    };

    render() {
        if (this.state.isLoading) {
            return <Spinner />;
        }
        if (!this.state.isLoading) {
            return this.renderRoutes();
        }
    }
}

export default App;
