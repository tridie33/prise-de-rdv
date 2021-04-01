module.exports = {
    presets: ["@babel/env"],
    plugins: [
        ["transform-inline-environment-variables", { include: ["BASE_URL"] }],
    ],
};
