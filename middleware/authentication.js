
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = function(req, res, next) {

    const authHeader = req.headers.authorization;

    //check if access token has been sent along with the request in headers and it's validity
    if( !authHeader || !authHeader.startsWith('Bearer')){
        throw new UnauthenticatedError('Invalid Access Token');
    }

    //extract the token
    const accessToken = authHeader.split(" ")[1];
    
    try{
        //check if the token is valid
        const decodedPayload = jwt.verify(accessToken, process.env.JWT_SECRET);

        //attach the user to the req object for the job routes
        req.user = {
            userId: decodedPayload._id,
            username: decodedPayload.name
        }

        next(); 

    }catch(err) {
        //we do not want to send the technical error message from the jwt verify method, to the user hence, we send a custom error message
        throw new UnauthenticatedError('Invalid Access Token');
    }
}

module.exports = { auth };