
const User = require('../models/User');
const { BadRequestError, UnauthenticatedError } = require('../errors/index');
const {StatusCodes} = require('http-status-codes');


//for registering a new user 
const register = async (req, res) => {

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