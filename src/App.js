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

        const setUser = (user, pathName) => {
            this.setState({ isLoading: false, user: user });
            this.history.push({
                pathname: pathName || "/",
            });
        };

        const setNoUser = redirectPath => {
            this.setState({ isLoading: false, user: false });
            this.history.push({
                pathname: "/login",
                search:
                    redirectPath &&
                    redirectPath !== "/login" &&
                    redirectPath !== "/"
                        ? `?redirect=${redirectPath}`
                        : "",
            });
        };

        OopCore.getLoggedInUser().catch(() => {
            const existingRedirect = queryString.parse(
                this.history.location.search,
            ).redirect;

            setNoUser(existingRedirect || this.history.location.pathname);
        });

        OopCore.on("loggedin", user => {
            setUser(
                user,
                queryString.parse(this.history.location.search).redirect,
            );
        });

        OopCore.on("loggedout", () => {
            setNoUser();
        });
    }

    pathName = props => {
        return queryString.parse(props.location.search).redirect || "/";
    };

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
