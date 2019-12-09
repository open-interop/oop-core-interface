const proxy = require("http-proxy-middleware");

module.exports = app => {
    app.use(
        "/api/v1",
        proxy({
            target: process.env.PROXY,
            changeOrigin: true,
        }),
    );
};
