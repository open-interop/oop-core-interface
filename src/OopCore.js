import cookie from "react-cookies";
const EventEmitter = require("events");

const RequestType = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
};

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

    makeRequest(endpoint, requestType, data = false, requireToken = true) {
        const token = this.token;
        if (!token && requireToken) {
            return Promise.reject(new Error("No token set."));
        }

        const options = {
            headers: { Authorization: token, Accept: "application/json" },
        };

        if (requestType === RequestType.GET) {
            options.method = "GET";
        }

        if (
            requestType === RequestType.POST ||
            requestType === RequestType.PUT
        ) {
            options.method = requestType;
            options.headers["Content-Type"] = "application/json";
            options.body = JSON.stringify(data);
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
            RequestType.POST,
            { email, password },
            false,
        ).then(response => {
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
        return this.makeRequest("/me", RequestType.GET).then(loggedInUser => {
            this.emit("loggedin", loggedInUser);
        });
    }

    getDevices() {
        return this.makeRequest("/devices", RequestType.GET);
    }

    getDevice(deviceId) {
        return this.makeRequest(`/devices/${deviceId}`, RequestType.GET);
    }

    updateDevice(device) {
        const data = { device: device };
        return this.makeRequest(`/devices/${device.id}`, RequestType.PUT, data);
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

        return this.makeRequest(path, RequestType.GET);
    }

    getTransmission(deviceId, transmissionId) {
        return this.makeRequest(
            `/devices/${deviceId}/transmissions/${transmissionId}`,
            RequestType.GET,
        );
    }

    getSites() {
        return this.makeRequest("/sites", RequestType.GET);
    }

    getDeviceGroups() {
        return this.makeRequest("/device_groups", RequestType.GET);
    }
}

export default new OopCore();
