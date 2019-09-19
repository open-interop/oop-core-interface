import React, { Component } from "react";
import { Router, Route, withRouter } from "react-router-dom";
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
            query: queryString.parse(this.history.location.search),
        };

        const setUser = user => {
            this.setState({ isLoading: false, user: user });

            if (/^\/login/.test(this.history.location.pathname)) {
                const pathname = this.state.query.redirect || "/";
                const query = this.state.query;
                delete query.redirect;
                this.setState({ query: query });

                this.history.push({
                    pathname: pathname,
                    search: queryString.stringify(query),
                });
            }
        };

        const setNoUser = () => {
            this.setState({ isLoading: false, user: false });

            if (!/^\/login/.test(this.history.location.pathname)) {
                const query = this.state.query;
                query.redirect = this.history.location.pathname;
                this.setState({ query: query });

                this.history.push({
                    pathname: "/login",
                    search: queryString.stringify(query),
                });
            }
        };

        OopCore.getLoggedInUser().catch(() => setNoUser());
        OopCore.on("loggedin", user => setUser(user));
        OopCore.on("loggedout", () => setNoUser());
    }

    HeaderWithRouter = withRouter(Header);

    SideNavigationWithRouter = withRouter(SideNavigation);

    renderRoutes = () => {
        return (
            <Router history={this.history}>
                {this.state.user ? (
                    <>
                        <this.HeaderWithRouter />
                        <this.SideNavigationWithRouter />
                        <div className="content">
                            <Route path="/" exact render={() => <Home />} />
                            <Route
                                path="/devices"
                                exact
                                render={() => <Devices />}
                            />
                            <Route
                                path="/settings"
                                exact
                                render={() => <Settings />}
                            />
                        </div>
                    </>
                ) : (
                    <Route path="/login" exact render={() => <Login />} />
                )}
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
