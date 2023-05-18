module.exports = {
    apps : [{
        name      : 'babydue-race-2',
        script    : 'app.js',
        env: {
            NODE_ENV: 'development'
        },
        env_production : {
            NODE_ENV: 'production'
        },
        cwd: "/var/www/babydue-race-2/www/current"
    }]
};