import React, { Component } from "react";
import { Router, Route, Redirect, withRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import {
    Devices,
    Header,
    Home,
    Login,
    Settings,
    SideNavigation,
} from "./components/View";
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
    ) => {
        return shouldRedirect ? (
            <Redirect
                to={{
                    pathname: redirectPath,
                    search: queryParameter ? `?redirect=${queryParameter}` : "",
                }}
            />
        ) : (
            <Component />
        );
    };

    renderRoutes = () => {
        return (
            <Router history={this.history}>
                <Route
                    path="/login"
                    exact
                    render={props =>
                        this.getRouteContent(
                            this.state.user,
                            this.pathName(props),
                            Login,
                        )
                    }
                />

                {this.state.user && (
                    <>
                        <this.HeaderWithRouter />
                        <this.SideNavigationWithRouter />
                    </>
                )}

                <div className="content">
                    <Route
                        path="/"
                        exact
                        render={() =>
                            this.getRouteContent(
                                !this.state.user,
                                "/login",
                                Home,
                            )
                        }
                    />
                    <Route
                        path="/devices"
                        exact
                        render={() =>
                            this.getRouteContent(
                                !this.state.user,
                                "/login",
                                Devices,
                                "/devices",
                            )
                        }
                    />
                    <Route
                        path="/settings"
                        exact
                        render={() =>
                            this.getRouteContent(
                                !this.state.user,
                                "/login",
                                Settings,
                                "/settings",
                            )
                        }
                    />
                </div>
            </Router>
        );
    };

    render() {
        if (this.state.isLoading) {
            return <div>LOADING</div>;
        }
        if (!this.state.isLoading) {
            return this.renderRoutes();
        }
    }
}

export default App;
