module.exports = {
    jest: function (config) {
        config.testMatch = ['**/?(*.)+(test).ts'];
        return config;
    }
};