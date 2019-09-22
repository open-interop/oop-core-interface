import cookie from "react-cookies";
const EventEmitter = require("events");

class OopCore extends EventEmitter {
    constructor(props) {
        super(props);

        this.apiBase = "http://localhost:3000/api";

        this.token = cookie.load("token");
    }

    saveCookie(name, value) {
        cookie.save(name, value, {
            path: "/",
            maxAge: 100000000,
        });
    }

    makeRequest(endpoint, postData = false, requireToken = true) {
        const token = this.token;
        if (!token && requireToken) {
            return Promise.reject(new Error("No token set."));
        }

        const options = {
            method: "GET",
            headers: { Authorization: token },
        };

        if (postData) {
            options.method = "POST";
            options.headers["Content-Type"] = "application/json";
            options.body = JSON.stringify(postData);
        }

        return fetch(this.apiBase + endpoint, options)
            .then(response => {
                if (response.status === 401) {
                    this.logout();

                    if (this.onLoggedOutFunc) {
                        this.onLoggedOutFunc();
                    }
                }
                if (response.status !== 200) {
                    throw new Error(response.statusText);
                }

                return response.json();
            })
            .catch(error => {
                throw error;
            });
    }

    login(email, password) {
        return this.makeRequest(
            "/auth/login",
            {
                email,
                password,
            },
            false,
        ).then(response => {
            this.token = response.token;
            this.saveCookie("token", response.token);
            return this.getLoggedInUser();
        });
    }

    logout() {
        cookie.remove("token");
        this.token = null;
        this.emit("loggedout");
        return Promise.resolve();
    }

    getLoggedInUser() {
        return this.makeRequest("/me").then(loggedInUser => {
            this.emit("loggedin", loggedInUser);
        });
    }

    getDevices() {
        return this.makeRequest("/devices");
    }

    getDeviceTransmissions(deviceId) {
        return this.makeRequest(`/devices/${deviceId}/transmissions`);
    }
}

export default new OopCore();
