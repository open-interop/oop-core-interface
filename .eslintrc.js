module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        jquery: true
    },
    extends: ["react-app", "standard", "prettier", "prettier/standard"],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
    },
    parserOptions: {
        ecmaVersion: 2018
    },
    plugins: ["prettier", "jest"],
    rules: {
        indent: [1, 4],
        curly: ["error", "all"],
        "comma-dangle": ["error", "always-multiline"],
        "prettier/prettier": "error",
        "linebreak-style": ["error", "unix"]
    }
};
