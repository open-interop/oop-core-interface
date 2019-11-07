import cookie from "react-cookies";
const queryString = require("query-string");
const EventEmitter = require("events");

const RequestType = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
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

    removeCookie(name) {
        cookie.remove(name, { path: "/" });
    }

    toCamelCase(s) {
        return s.replace(/[-_]([a-z])/gi, ($0, $1) => {
            return $1.toUpperCase();
        });
    }

    toSnakeCase(s) {
        return s
            .replace(/^\w/, c => c.toLowerCase())
            .replace(/[A-Z]/g, $1 => {
                return "_" + $1.toLowerCase();
            });
    }

    isObject(o) {
        return o === Object(o) && !Array.isArray(o) && typeof o !== "function";
    }

    doNotConvert = fieldName => {
        return fieldName === "externalUuids" || fieldName === "headers";
    };

    snakeToCamel(o) {
        if (this.isObject(o)) {
            const n = {};

            Object.keys(o).forEach(k => {
                if (this.doNotConvert(k)) {
                    n[this.toCamelCase(k)] = o[k];
                } else {
                    n[this.toCamelCase(k)] = this.snakeToCamel(o[k]);
                }
            });

            return n;
        } else if (Array.isArray(o)) {
            return o.map(i => {
                return this.snakeToCamel(i);
            });
        }

        return o;
    }

    camelToSnake(o) {
        if (this.isObject(o)) {
            const n = {};

            Object.keys(o).forEach(k => {
                if (this.doNotConvert(k)) {
                    n[this.toSnakeCase(k)] = o[k];
                } else {
                    n[this.toSnakeCase(k)] = this.camelToSnake(o[k]);
                }
            });

            return n;
        } else if (Array.isArray(o)) {
            return o.map(i => {
                return this.camelToSnake(i);
            });
        }

        return o;
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
            options.body = JSON.stringify(this.camelToSnake(data));
        }

        return fetch(this.apiBase + endpoint, options)
            .then(response => {
                if (response.status === 401) {
                    this.logout();

                    if (this.onLoggedOutFunc) {
                        this.onLoggedOutFunc();
                    }
                }

                return response
                    .json()
                    .then(body => this.snakeToCamel(body))
                    .then(body => {
                        if (
                            response.status === 200 ||
                            response.status === 201 ||
                            response.status === 204
                        ) {
                            return body;
                        } else {
                            throw body;
                        }
                    });
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

    resetPassword(user) {
        const data = { user: user };
        return this.makeRequest(
            `/passwords/reset`,
            RequestType.POST,
            data,
            false,
        );
    }

    logout() {
        this.removeCookie("token");
        this.token = null;
        this.emit("loggedout");
        return Promise.resolve();
    }

    getSelectedSite() {
        const currentCookie = cookie.load("site");
        const cookieObject = currentCookie || null;
        return cookieObject;
    }

    getCurrentSite() {
        const currentCookie = this.getSelectedSite();
        if (currentCookie) {
            return this.getSite(currentCookie.id);
        } else {
            return Promise.resolve(null);
        }
    }

    selectSite(site) {
        if (site) {
            this.saveCookie("site", JSON.stringify(site));
        } else {
            this.removeCookie("site");
        }
    }

    getLoggedInUser() {
        return this.makeRequest("/me").then(loggedInUser => {
            this.emit("loggedin", loggedInUser);
        });
    }

    getDevices(queryParameters) {
        const parameters = this.getParameters(queryParameters);
        let path = `/devices`;
        if (parameters) {
            path += `?${parameters}`;
        }

        return this.makeRequest(path);
    }

    getDevice(deviceId) {
        return this.makeRequest(`/devices/${deviceId}`);
    }

    updateDevice(data) {
        const payload = { device: data };
        return this.makeRequest(
            `/devices/${data.id}`,
            RequestType.PUT,
            payload,
        );
    }

    createDevice(device) {
        const data = { device: device };
        return this.makeRequest(`/devices`, RequestType.POST, data);
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
                return `filter[${this.toSnakeCase(key)}]`;
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
            path += `?${parameters}`;
        }

        return this.makeRequest(path);
    }

    getTransmission(deviceId, transmissionId) {
        return this.makeRequest(
            `/devices/${deviceId}/transmissions/${transmissionId}`,
        );
    }

    getSites(queryParameters) {
        const parameters = this.getParameters({ filters: queryParameters });
        let path = `/sites`;
        if (parameters) {
            path += `?${parameters}`;
        }

        return this.makeRequest(path);
    }

    getSite(siteId) {
        return this.makeRequest(`/sites/${siteId}`);
    }

    createSite(data) {
        return this.makeRequest(`/sites`, RequestType.POST, data);
    }

    updateSite(siteId, data) {
        const payload = { site: data };
        return this.makeRequest(`/sites/${siteId}`, RequestType.PUT, payload);
    }

    getDeviceGroups(queryParameters) {
        const parameters = this.getParameters(queryParameters);
        let path = `/device_groups`;
        if (parameters) {
            path += `?${parameters}`;
        }

        return this.makeRequest(path);
    }

    getTemprs(queryParameters) {
        const parameters = this.getParameters(queryParameters);
        let path = `/temprs`;
        if (parameters) {
            path += `?${parameters}`;
        }

        return this.makeRequest(path);
    }

    getTempr(temprId) {
        return this.makeRequest(`/temprs/${temprId}`);
    }

    updateTempr(temprId, data) {
        return this.makeRequest(`/temprs/${temprId}`, RequestType.PUT, data);
    }

    createTempr(data) {
        return this.makeRequest(`/temprs`, RequestType.POST, data);
    }

    getDeviceTemprs(queryParameters) {
        const parameters = this.getParameters(queryParameters);
        let path = `/device_temprs`;
        if (parameters) {
            path += `?${parameters}`;
        }

        return this.makeRequest(path);
    }

    createDeviceTempr(queryParameters) {
        const parameters = queryString.stringify(
            this.camelToSnake(queryParameters),
        );
        let path = `/device_temprs`;
        if (parameters) {
            path += `?${parameters}`;
        }

        return this.makeRequest(path, RequestType.POST);
    }

    deleteDeviceTempr(deviceTemprId, queryParameters) {
        const parameters = queryString.stringify(
            this.camelToSnake(queryParameters),
        );
        let path = `/device_temprs/${deviceTemprId}`;
        if (parameters) {
            path += `?${parameters}`;
        }

        return this.makeRequest(path, RequestType.DELETE);
    }

    getUsers(queryParameters) {
        const parameters = this.getParameters(queryParameters);
        let path = `/users`;
        if (parameters) {
            path += `?${parameters}`;
        }

        return this.makeRequest(path);
    }

    getUser(userId) {
        return this.makeRequest(`/users/${userId}`);
    }

    updateUser(userId, data) {
        const payload = {
            user: data,
        };
        return this.makeRequest(`/users/${userId}`, RequestType.PUT, payload);
    }

    createUser(data) {
        const payload = {
            user: data,
        };
        return this.makeRequest(`/users`, RequestType.POST, payload);
    }
}

export default new OopCore();
