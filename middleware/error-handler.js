
const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {

  //This customeError object first checks that if the err object already has statusCode and message from our error Classes, otherwise we give it some default values.If we have mongoose error, then eventually this object will be manipulated for handling those mongoose errors as well.
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again later.'
  }

  //if error code exists in error object and the code is '11000', it is actually for attempt to enter duplicate values for unique fields in mongoose (like trying to register an user with an already existing email).
  if(err.code && err.code==11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;//400
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
  }


  //Handling Validation error in mongoose (e.g - user does not provide mail and password while registering)
  if(err.name =='ValidationError') {
    //Object.value(obj) returns an array of the values of an object obj
    customError.msg = Object.values(err.errors).map((item) => item.message).join(',');
    customError.statusCode = StatusCodes.BAD_REQUEST;//400
  }

  //Handling Cast error in mongoose (e.g - while fetching a single job, if we mess up the job Id by adding a few more characters to it or removing some characters from it)
  if(err.name == 'CastError') {
    customError.msg = `No item found with Id ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;//404
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
}

module.exports = errorHandlerMiddleware;
