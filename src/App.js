import React, { Component } from "react";
import { Router, Route, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Devices, Home, Login } from "./components/View";
import api from "./APIservice";

class App extends Component {
    constructor(props) {
        super(props);

        this.history = createBrowserHistory();

        this.state = {
            isLoading: true,
            user: false,
        };

        api.onLoggedOut(() => this.setState({ isLoading: false, user: false }));
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
            sessionStorage.getItem("sessionStoragePathName") ||
            "/"
        );
    };

    savePathNameInSessionStorage = pathName => {
        sessionStorage.setItem("sessionStoragePathName", pathName);
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
                        this.savePathNameInSessionStorage("/");
                        return this.state.user ? (
                            <Home />
                        ) : (
                            <Redirect
                                to={{
                                    pathname: "/login",
                                    nextPath: "/",
                                }}
                            />
                        );
                    }}
                />
                <Route
                    path="/devices"
                    exact
                    render={() => {
                        this.savePathNameInSessionStorage("/devices");
                        return this.state.user ? (
                            <Devices />
                        ) : (
                            <Redirect
                                to={{
                                    pathname: "/login",
                                    nextPath: "/devices",
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
