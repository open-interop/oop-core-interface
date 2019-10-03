import cookie from "react-cookies";
const EventEmitter = require("events");

class OopCore extends EventEmitter {
    constructor(props) {
        super(props);

        this.apiBase = "/api/v1";

        this.token = cookie.load("token");
    }

    saveCookie(name, value) {
        cookie.save(name, value, {
            path: "/",
            maxAge: 100000000,
        });
    }

    makeRequest({
        endpoint,
        postData = false,
        putData = false,
        requireToken = true,
    }) {
        const token = this.token;
        if (!token && requireToken) {
            return Promise.reject(new Error("No token set."));
        }

        const options = {
            method: "GET",
            headers: { Authorization: token, Accept: "application/json" },
        };

        if (postData) {
            options.method = "POST";
            options.headers["Content-Type"] = "application/json";
            options.body = JSON.stringify(postData);
        }

        if (putData) {
            options.method = "PUT";
            options.headers["Content-Type"] = "application/json";
            options.body = JSON.stringify(putData);
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
        return this.makeRequest({
            endpoint: "/auth/login",
            postData: {
                email,
                password,
            },
            requireToken: false,
        }).then(response => {
            this.token = response.token;
            this.saveCookie("token", response.token);
            return this.getLoggedInUser();
        });
    }

    logout() {
        cookie.remove("token", { path: "/" });
        this.token = null;
        this.emit("loggedout");
        return Promise.resolve();
    }

    getLoggedInUser() {
        return this.makeRequest({ endpoint: "/me" }).then(loggedInUser => {
            this.emit("loggedin", loggedInUser);
        });
    }

    getDevices() {
        return this.makeRequest({ endpoint: "/devices" });
    }

    getDevice(deviceId) {
        return this.makeRequest({ endpoint: `/devices/${deviceId}` });
    }

    updateDevice(device) {
        const data = { device: device };
        return this.makeRequest({
            endpoint: `/devices/${device.id}`,
            putData: data,
        });
    }

    mapQueryParameter(key) {
        switch (key) {
            case "pageSize":
                return "page[size]";
            case "page":
                return "page[number]";
            case "transmissionUuid":
                return "transmission_uuid";
            case "messageUuid":
                return "message_uuid";
            default:
                return key;
        }
    }

    getTransmissions(deviceId, queryParameters) {
        const parameters = Object.keys(queryParameters)
            .map(
                key => `${this.mapQueryParameter(key)}=${queryParameters[key]}`,
            )
            .join("&");

        let path = `/devices/${deviceId}/transmissions`;
        if (parameters) {
            path += "/?" + parameters;
        }

        return this.makeRequest({ endpoint: path });
    }

    getTransmission(deviceId, transmissionId) {
        return this.makeRequest({
            endpoint: `/devices/${deviceId}/transmissions/${transmissionId}`,
        });
    }

    getSites() {
        return this.makeRequest({ endpoint: "/sites" });
    }

    getDeviceGroups() {
        return this.makeRequest({ endpoint: "/device_groups" });
    }
}

export default new OopCore();
