import React, { Component } from "react";
import { Router, Route, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Dashboard, Login } from "./components/View";
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

    renderRoutes = () => {
        return (
            <Router history={this.history}>
                <Route
                    path="/login"
                    exact
                    render={() =>
                        this.state.user ? (
                            <Redirect
                                to={{
                                    pathname: "/",
                                }}
                            />
                        ) : (
                            <Login />
                        )
                    }
                />
                <Route
                    path="/"
                    exact
                    render={() =>
                        this.state.user ? (
                            <Dashboard />
                        ) : (
                            <Redirect
                                to={{
                                    pathname: "/login",
                                    nextPath: "/passing from props",
                                }}
                            />
                        )
                    }
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
