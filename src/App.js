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
const queryString = require("query-string");

class App extends Component {
    constructor(props) {
        super(props);

        this.history = createBrowserHistory();

        this.state = {
            isLoading: true,
            user: false,
        };

        OopCore.onLoggedOut(() => {
            this.setState({ isLoading: false, user: false });
        });
        OopCore.onLoggedIn(user => {
            this.setState({ isLoading: false, user: user });
        });

        OopCore.getLoggedInUser().catch(() => {
            this.setState({ isLoading: false, user: false });
        });
    }

    pathName = props => {
        return (
            props.location.nextPath ||
            queryString.parse(props.location.search).redirect ||
            "/"
        );
    };

    HeaderWithRouter = withRouter(Header);

    SideNavigationWithRouter = withRouter(SideNavigation);

    renderRoutes = () => {
        return (
            <Router history={this.history}>
                <Route
                    path="/login"
                    exact
                    render={props =>
                        this.state.user ? (
                            <Redirect
                                to={{
                                    pathname: this.pathName(props),
                                }}
                            />
                        ) : (
                            <Login nextPath={this.pathName(props)} />
                        )
                    }
                />

                <>
                    {this.state.user && <this.HeaderWithRouter />}
                    {this.state.user && <this.SideNavigationWithRouter />}
                    <div className="content">
                        <Route
                            path="/"
                            exact
                            render={() => {
                                return this.state.user ? (
                                    <Home />
                                ) : (
                                    <Redirect
                                        to={{
                                            pathname: "/login",
                                        }}
                                    />
                                );
                            }}
                        />
                        <Route
                            path="/devices"
                            exact
                            render={() => {
                                return this.state.user ? (
                                    <Devices />
                                ) : (
                                    <Redirect
                                        to={{
                                            pathname: "/login",
                                            search: "?redirect=/devices",
                                        }}
                                    />
                                );
                            }}
                        />
                        <Route
                            path="/settings"
                            exact
                            render={() => {
                                return this.state.user ? (
                                    <Settings />
                                ) : (
                                    <Redirect
                                        to={{
                                            pathname: "/login",
                                            search: "?redirect=/settings",
                                        }}
                                    />
                                );
                            }}
                        />
                    </div>
                </>
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
