const { token } = require('morgan');

require('dotenv').config();

const auth0Config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    routes: {
        login: '/login',
        logout: '/logout',
        callback: '/callback',
    }
};

const managementConfig = {
    clientID: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
    clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
    audience: process.env.AUTH0_MANAGEMENT_AUDIENCE,
    tokenEndpoint: `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`
   
};

module.exports = {
    auth0Config,
    managementConfig
}