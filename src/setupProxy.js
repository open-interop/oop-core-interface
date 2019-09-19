const proxy = require("http-proxy-middleware");

module.exports = app => {
    app.use(
        "/api",
        proxy({
            target: "http://diditagain.bluefrontier.local:9009",
            changeOrigin: true,
            pathRewrite: {
                "^/api": "/api/v1",
            },
        }),
    );
};
