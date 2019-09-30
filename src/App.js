import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, withRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import {
    Devices,
    DeviceTransmissions,
    Header,
    Home,
    Login,
    Settings,
    SideNavigation,
} from "./components/View";
import { Spinner } from "./components/Universal";
import OopCore from "./OopCore";
import "./styles/App.scss";
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

    pathName = props => {
        return queryString.parse(props.location.search).redirect || "/";
    };

    HeaderWithRouter = withRouter(Header);

    SideNavigationWithRouter = withRouter(SideNavigation);

    getRouteContent = (
        shouldRedirect,
        redirectPath,
        Component,
        queryParameter,
        routeProps,
    ) => {
        return shouldRedirect ? (
            <Redirect
                to={{
                    pathname: redirectPath,
                    search:
                        queryParameter &&
                        queryParameter !== "/login" &&
                        queryParameter !== "/"
                            ? `?redirect=${queryParameter}`
                            : "",
                }}
            />
        ) : queryParameter === "/login" ? (
            <div className="login">
                <Component {...routeProps} />
            </div>
        ) : (
            <div className="content">
                <Component {...routeProps} />
            </div>
        );
    };

    renderRoutes = () => {
        return (
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Route
                    path="/login"
                    exact
                    render={props =>
                        this.getRouteContent(
                            this.state.user,
                            this.pathName(props),
                            Login,
                            "/login",
                        )
                    }
                />
                {this.state.user && (
                    <div className="left-side">
                        <this.SideNavigationWithRouter />
                    </div>
                )}

                <div className="right-side">
                    {this.state.user && <this.HeaderWithRouter />}
                    <Route
                        path="/"
                        exact
                        render={routeProps =>
                            this.getRouteContent(
                                !this.state.user,
                                "/login",
                                Home,
                                routeProps.match.url,
                            )
                        }
                    />
                    <Route
                        path="/devices"
                        exact
                        render={routeProps =>
                            this.getRouteContent(
                                !this.state.user,
                                "/login",
                                Devices,
                                routeProps.match.url,
                            )
                        }
                    />
                    <Route
                        path="/devices/:deviceId/transmissions"
                        exact
                        render={routeProps => {
                            return this.getRouteContent(
                                !this.state.user,
                                "/login",
                                DeviceTransmissions,
                                routeProps.match.url,
                                routeProps,
                            );
                        }}
                    />
                    <Route
                        path="/settings"
                        exact
                        render={routeProps =>
                            this.getRouteContent(
                                !this.state.user,
                                "/login",
                                Settings,
                                routeProps.match.url,
                            )
                        }
                    />
                </div>
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
