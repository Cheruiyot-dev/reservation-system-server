const jwt = require('jsonwebtoken');
const axios = require('axios');
const { auth0Config, managementConfig } = require('../config/auth0');

//Authentication middleware
const authenticatedUser = async( req, res, next ) => {
    try {
        //Check if the user is authenticated using Auth0
        if(req.oidc && req.oidc.isAuthenticated()) {
            
            //Add user information to the request object
            req.user = {
                id: req.oidc.user.sub,
                email: req.oidc.user.email,
                username: req.oidc.user.nickname || req.oidc.user.name
            };
             return next();
        }
       

        //Also check for a valid JWT token in the header from the incoming request
        // The optional chaining operator (?.) is used to safely access properties that may not exist. If the header is missing or malformed, it will not throw an error.
        // Token will be undefined.
        // If the token is present, it will be extracted and used to verify the user's identity.
        // The 'Bearer ' prefix is removed to get the actual token string. with .replace() method.
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({error: 'Access denied. No token provided.'});
        }

        // Verify the token using the secret key from the environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
         console.error('Authentication error:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// Get Auth0 Management API token
const getManagementApiToken = async () => {
 try{
       const response = await axios.post(managementConfig.tokenEndpoint, {
        client_id: managementConfig.clientID,
        client_secret: managementConfig.clientSecret,
        audience: managementConfig.audience,
        grant_type: 'client_credentials'
    });

    return response.data.access_token;

 } catch (error) {
    console.error('Error getting management API token:', error);
    throw error;

 }
}

// Middleware to check if the user is an admin
const requireAdmin = async( req, res, next) => {
    if(!req.user || !req.user.roles || !req.user.roles.includes('admin')) {
        return res.status(403).json({ error: 'Access denied. Admins role is required.' });
    }
    next();
}

module.exports = {
    authenticatedUser,
    getManagementApiToken,
    requireAdmin
};