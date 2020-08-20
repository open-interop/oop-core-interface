import cookie from "react-cookies";
const queryString = require("query-string");
const EventEmitter = require("events");

const RequestType = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
};

const uri = (strings, ...values) => {
    const encoded = values.map(encodeURIComponent);
    const parts = [...strings.raw];
    let ret = parts.shift();

    while (parts.length) {
        ret += encoded.shift() + parts.shift();
    }

    return ret;
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
        return String(s)
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

                if (response.status === 204) {
                    return null;
                }
                return response
                    .json()
                    .then(body => this.snakeToCamel(body))
                    .then(body => {
                        if (response.status >= 200 && response.status < 300) {
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

    requestPasswordReset(user) {
        const data = { email: user.email };
        return this.makeRequest(`/passwords`, RequestType.POST, data, false);
    }

    resetPassword(token, password, passwordConfirmation) {
        const data = {
            token: token,
            password: password,
            passwordConfirmation: passwordConfirmation,
        };
        return this.makeRequest(
            `/passwords/reset`,
            RequestType.POST,
            this.camelToSnake(data),
            false,
        );
    }

    logout() {
        this.removeCookie("token");
        this.token = null;
        this.emit("loggedout");
        return Promise.resolve();
    }

    getCurrentSite() {
        const currentCookie = cookie.load("site") || null;
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

    getCurrentTimeRange() {
        return cookie.load("range") || null;
    }

    selectTimeRange(timeRange) {
        if (timeRange) {
            this.saveCookie("range", JSON.stringify(timeRange));
        } else {
            this.removeCookie("range");
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
        device.authenticationPath = device.authenticationPath || null;
        return this.makeRequest(`/devices`, RequestType.POST, data);
    }

    deleteDevice(deviceId) {
        return this.makeRequest(`/devices/${deviceId}`, RequestType.DELETE);
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

    deleteDeviceGroup(deviceGroupId) {
        return this.makeRequest(
            `/device_groups/${deviceGroupId}`,
            RequestType.DELETE,
        );
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

    deleteSite(siteId) {
        return this.makeRequest(`/sites/${siteId}`, RequestType.DELETE);
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

    deleteTempr(temprId) {
        return this.makeRequest(`/temprs/${temprId}`, RequestType.DELETE);
    }

    previewTempr(data) {
        return this.makeRequest(`/temprs/preview`, RequestType.POST, data);
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

    deleteUser(userId) {
        return this.makeRequest(`/users/${userId}`, RequestType.DELETE);
    }

    getDevicesByGroup(queryParameters) {
        const parameters = queryString.stringify(
            this.camelToSnake(queryParameters),
        );
        let path = `/sites/sidebar`;
        if (parameters) {
            path += `?${parameters}`;
        }

        return this.makeRequest(path);
    }

    mapStatsParams(key) {
        switch (key) {
            case "gteq":
            case "gt":
                return `filter[transmitted_at[${key}]]`;
            case "siteId":
            case "deviceId":
                return `filter[${key}]`;
            case "field":
            case "direction":
                return `filter[sort][${key}]`;
            default:
                return key;
        }
    }

    getTransmissionStats(filters) {
        const formattedFilters = {};

        Object.keys(filters)
            .filter(key => filters[key] !== undefined)
            .forEach(key => {
                formattedFilters[
                    this.mapStatsParams(key)
                ] = this.toSnakeCase(filters[key]);
            });

        var parameters = queryString.stringify(
            this.camelToSnake(formattedFilters),
        );

        let path = "/dashboards/transmissions";
        if (parameters) {
            path += `?${parameters}`;
        }

        return this.makeRequest(path);
    }

    getSchedules(queryParameters) {
        const parameters = this.getParameters(queryParameters);
        let path = `/schedules`;
        if (parameters) {
            path += `?${parameters}`;
        }

        return this.makeRequest(path);
    }

    getSchedule(id) {
        return this.makeRequest(uri`/schedules/${id}`);
    }

    createSchedule(data) {
        const payload = { schedule: data };
        return this.makeRequest(`/schedules`, RequestType.POST, payload);
    }

    updateSchedule(schedule) {
        return this.makeRequest(
            uri`/schedules/${schedule.id}`,
            RequestType.PUT,
            { schedule },
        );
    }

    deleteSchedule(scheduleId) {
        return this.makeRequest(
            uri`/schedules/${scheduleId}`,
            RequestType.DELETE,
        );
    }

    getScheduleTemprs(params) {
        const parameters = this.getParameters(params);
        let path = `/schedule_temprs`;
        if (parameters) {
            path += `?${parameters}`;
        }

        return this.makeRequest(path);
    }

    createScheduleTempr({ scheduleId, temprId }) {
        return this.makeRequest(
            uri`/schedule_temprs?tempr_id=${temprId}&schedule_id=${scheduleId}`,
            RequestType.POST,
        );
    }

    deleteScheduleTempr(id, data) {
        return this.makeRequest(
            uri`/schedule_temprs/${id}?tempr_id=${data.temprId}&schedule_id=${data.scheduleId}`,
            RequestType.DELETE,
        );
    }

    getBlacklistEntries(queryParameters) {
        const parameters = this.getParameters(queryParameters);
        let path = `/blacklist_entries`;
        if (parameters) {
            path += `?${parameters}`;
        }

        return this.makeRequest(path);
    }

    getBlacklistEntry(id) {
        return this.makeRequest(uri`/blacklist_entries/${id}`);
    }

    createBlacklistEntry(data) {
        const payload = { blacklistEntry: data };
        return this.makeRequest(`/blacklist_entries`, RequestType.POST, payload);
    }

    updateBlacklistEntry(id, blacklistEntry) {
        return this.makeRequest(
            uri`/blacklist_entries/${id}`,
            RequestType.PUT,
            { blacklistEntry },
        );
    }

    deleteBlacklistEntry(id) {
        return this.makeRequest(
            uri`/blacklist_entries/${id}`,
            RequestType.DELETE,
        );
    }

    getLayers(queryParameters) {
        const parameters = this.getParameters(queryParameters);
        let path = `/layers`;
        if (parameters) {
            path += `?${parameters}`;
        }

        return this.makeRequest(path);
    }

    getLayer(id) {
        return this.makeRequest(uri`/layers/${id}`);
    }

    createLayer(data) {
        const payload = { layer: data };
        return this.makeRequest(`/layers`, RequestType.POST, payload);
    }

    updateLayer(layer) {
        return this.makeRequest(
            uri`/layers/${layer.id}`,
            RequestType.PUT,
            { layer },
        );
    }

    deleteLayer(layerId) {
        return this.makeRequest(
            uri`/layers/${layerId}`,
            RequestType.DELETE,
        );
    }

    getTemprLayers(params) {
        const parameters = this.getParameters(params);
        let path = `/tempr_layers`;
        if (parameters) {
            path += `?${parameters}`;
        }

        return this.makeRequest(path);
    }

    createTemprLayer({ temprId, layerId }) {
        return this.makeRequest(
            uri`/tempr_layers?tempr_id=${temprId}&layer_id=${layerId}`,
            RequestType.POST,
        );
    }

    deleteTemprLayer(id, data) {
        return this.makeRequest(
            uri`/tempr_layers/${id}?tempr_id=${data.temprId}&layer_id=${data.layerId}`,
            RequestType.DELETE,
        );
    }
}

export default new OopCore();
