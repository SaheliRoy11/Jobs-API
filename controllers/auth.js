
const User = require('../models/User');
const { BadRequestError, UnauthenticatedError } = require('../errors/index');
const {StatusCodes} = require('http-status-codes');


//for registering a new user 
const register = async (req, res) => {

    //retreive the user credentials from req.body, as created by using express.json() middleware
    const {name, email, password} = req.body;

    //if any of the values are not provided then throw back error
    if(!name || !email || !password) { 

        //sent bad request error to user 
        //If email or password is missing during a login attempt, the appropriate HTTP error code is 400 Bad Request. This indicates that the server understood the request but cannot process it due to a client-side error.

        throw new BadRequestError('Please provide name, email and password');
    }

    //check if the email provided by the new user who wants to register, is already present in the db, this is because the email needs to be unique for every user
    const user = await User.findOne({email});

    //if an user is found that means there is already an user with the email, so send back a response to the new user, so that they can register with other email
    if(user) {
        return res.status(StatusCodes.CONFLICT).json({
            msg: 'Please try with other email'//A 409 status code means that the server couldn't process your browser's request because there's a conflict with the relevant resource.
        })
    }  

    //create the user in db
    const newUser = await User.create(req.body);

    //create access token for user
    const accessToken = newUser.createJWT();
   
    //send response back to user
    return res.status(StatusCodes.CREATED).json({//status code CREATED means the request is successful and a new resource has been created
        user:{
            name: newUser.name
        },
        accessToken
    })
}


const login = async(req, res) => {
    const {email, password } = req.body;

    if(!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }

    // check if email match
    const user = await User.findOne({email});

    //if user exists then check the password
    if(user) {
        const {isMatch} = await user.verifyPassword(password);

        //if password is matched then send back the response
        if(isMatch) {
            const accessToken = user.createJWT();
            return res.status(StatusCodes.OK).json({user: {
                name: user.name
            }, accessToken});
        }
    }

    //user did not provide valid credentials
    throw new UnauthenticatedError('User mail or password did not match');

}

module.exports = { register, login };