module.exports = {
    presets: ["@babel/env"],
    plugins: [
        ["transform-inline-environment-variables", { include: ["BASE_URL"] }],
    ],
    comments: false,
    minified: true,
    sourceMaps: true,
};
