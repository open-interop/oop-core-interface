import React, { Component } from "react";
import { Router, Route, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Devices, Home, Login, Settings } from "./components/View";
import { ComponentWithNavigation } from "./components/Global";
import api from "./APIservice";
const queryString = require("query-string");

class App extends Component {
    constructor(props) {
        super(props);

        this.history = createBrowserHistory();

        this.state = {
            isLoading: true,
            user: false,
        };

        api.onLoggedOut(() => {
            this.setState({ isLoading: false, user: false });
        });
        api.onLoggedIn(user => {
            this.setState({ isLoading: false, user: user });
        });

        api.getLoggedInUser().catch(() => {
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
                <Route
                    path="/"
                    exact
                    render={() => {
                        return this.state.user ? (
                            <ComponentWithNavigation
                                component={Home}
                                history={this.history}
                            />
                        ) : (
                            <Redirect
                                to={{
                                    pathname: "/login",
                                    search: "?redirect=/",
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
                            <ComponentWithNavigation
                                component={Devices}
                                history={this.history}
                            />
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
                            <ComponentWithNavigation
                                component={Settings}
                                history={this.history}
                            />
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
