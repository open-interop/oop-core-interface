import cookie from "react-cookies";
const queryString = require("query-string");
const EventEmitter = require("events");

const RequestType = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
};

class OopCore extends EventEmitter {
    constructor(props) {
        super(props);

        this.apiBase = (process.env.REACT_APP_BASE_PATH || "") + "/api/v1";

        this.token = cookie.load("token");
    }

    saveCookie(name, value) {
        cookie.save(name, value, {
            path: "/",
            maxAge: 100000000,
        });
    }

    makeRequest(
        endpoint,
        requestType = RequestType.GET,
        data = false,
        requireToken = true,
    ) {
        const token = this.token;
        if (!token && requireToken) {
            return Promise.reject(new Error("No token set."));
        }

        const options = {
            headers: { Authorization: token, Accept: "application/json" },
            method: requestType,
        };

        if (
            requestType === RequestType.POST ||
            requestType === RequestType.PUT
        ) {
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
                if (response.status !== 200 && response.status !== 201) {
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
        return this.makeRequest("/me").then(loggedInUser => {
            this.emit("loggedin", loggedInUser);
        });
    }

    getDevices() {
        return this.makeRequest("/devices");
    }

    getDevice(deviceId) {
        return this.makeRequest(`/devices/${deviceId}`);
    }

    updateDevice(device) {
        const data = { device: device };
        return this.makeRequest(`/devices/${device.id}`, RequestType.PUT, data);
    }

    updateDeviceGroup(deviceGroup) {
        const payload = { device_group: deviceGroup };
        return this.makeRequest(
            `/device_groups/${deviceGroup.id}`,
            RequestType.PUT,
            payload,
        );
    }

    createDeviceGroup(deviceGroup) {
        const payload = { device_group: deviceGroup };
        return this.makeRequest(`/device_groups`, RequestType.POST, payload);
    }

    getDeviceGroup(deviceGroupId) {
        return this.makeRequest(`/device_groups/${deviceGroupId}`);
    }

    mapQueryParameter(key) {
        switch (key) {
            case "pageSize":
                return "page[size]";
            case "page":
                return "page[number]";
            default:
                return `filter[${key}]`;
        }
    }

    getParameters(params) {
        // extract the parameters found in filters into the base queryParameters object
        const queryParameters = { ...params };
        if (queryParameters && queryParameters.filters) {
            Object.keys(queryParameters.filters).forEach(filter => {
                queryParameters[filter] = queryParameters.filters[filter];
            });
            delete queryParameters.filters;
        }

        const parametersObject = {};

        Object.keys(queryParameters)
            .filter(key => queryParameters[key] !== undefined)
            .forEach(
                key =>
                    (parametersObject[this.mapQueryParameter(key)] =
                        queryParameters[key]),
            );

        return queryString.stringify(parametersObject);
    }

    getTransmissions(deviceId, queryParameters) {
        const parameters = this.getParameters(queryParameters);
        let path = `/devices/${deviceId}/transmissions`;
        if (parameters) {
            path += "/?" + parameters;
        }

        return this.makeRequest(path);
    }

    getTransmission(deviceId, transmissionId) {
        return this.makeRequest(
            `/devices/${deviceId}/transmissions/${transmissionId}`,
        );
    }

    getSites() {
        return this.makeRequest("/sites");
    }

    getDeviceGroups() {
        return this.makeRequest("/device_groups");
    }

    getTemprs(deviceGroupId, queryParameters) {
        const parameters = this.getParameters(queryParameters);
        let path = `/device_groups/${deviceGroupId}/temprs`;
        if (parameters) {
            path += "/?" + parameters;
        }

        return this.makeRequest(path);
    }

    getTempr(deviceGroupId, temprId) {
        return this.makeRequest(
            `/device_groups/${deviceGroupId}/temprs/${temprId}`,
        );
    }

    updateTempr(deviceGroupId, temprId, data) {
        return this.makeRequest(
            `/device_groups/${deviceGroupId}/temprs/${temprId}`,
            RequestType.PUT,
            data,
        );
    }

    createTempr(deviceGroupId, data) {
        return this.makeRequest(
            `/device_groups/${deviceGroupId}/temprs`,
            RequestType.POST,
            data,
        );
    }

    getDeviceTemprs(deviceGroupId, queryParameters) {
        const parameters = this.getParameters(queryParameters);
        let path = `/device_groups/${deviceGroupId}/device_temprs`;
        if (parameters) {
            path += "/?" + parameters;
        }

        return this.makeRequest(path);
    }

    getDeviceTempr(deviceGroupId, deviceTemprId) {
        return this.makeRequest(
            `/device_groups/${deviceGroupId}/device_temprs/${deviceTemprId}`,
        );
    }

    createDeviceTemprObject = data => {
        const result = {};
        result.device_id = data.deviceId;
        result.tempr_id = data.temprId;
        result.endpoint_type = data.endpointType;
        result.queue_response = data.queueResponse;
        const {
            headers,
            host,
            path,
            port,
            protocol,
            requestMethod,
            // eslint-disable-next-line no-unused-vars
            ...rest
        } = data.template;
        result.options = { headers, host, path, port, protocol, requestMethod };
        return result;
    };

    createUserObject = data => {
        const result = {};
        result.email = data.email;
        result.password = data.newPassword;
        result.confirm_password = data.confirmPassword;
        result.time_zone = data.time_zone;
        return result;
    };

    updateDeviceTempr(deviceGroupId, deviceTemprId, data) {
        const payload = {
            device_tempr: this.createDeviceTemprObject(data),
        };
        return this.makeRequest(
            `/device_groups/${deviceGroupId}/device_temprs/${deviceTemprId}`,
            RequestType.PUT,
            payload,
        );
    }

    createDeviceTempr(deviceGroupId, data) {
        const payload = {
            device_tempr: this.createDeviceTemprObject(data),
        };
        return this.makeRequest(
            `/device_groups/${deviceGroupId}/device_temprs`,
            RequestType.POST,
            payload,
        );
    }

    getUsers() {
        return this.makeRequest("/users");
    }

    getUser(userId) {
        return this.makeRequest(`/users/${userId}`);
    }

    updateUser(userId, data) {
        const payload = {
            user: this.createUserObject(data),
        };
        return this.makeRequest(`/users/${userId}`, RequestType.PUT, payload);
    }

    createUser(data) {
        const payload = {
            user: this.createUserObject(data),
        };
        return this.makeRequest(`/users`, RequestType.POST, payload);
    }
}

export default new OopCore();
