
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name should be provided'],
        maxLength: 50
    },
    email: {
        type: String,
        required: [true, 'Email should be provided'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please provide valid email"
        ]
    },
    password: {
        type: String,
        required: [true, 'Password should be provided'],
        minLength: 6
    }
}, {timestamps: true});


// mongoose middleware
//before we save the document, what do we want to accomplish
userSchema.pre('save', async function () {// do not use arrow function because we need 'this' to point to our document
    
    //hash password before storing in db (genSalt function can take only number type as input)
    const salt = await bcrypt.genSalt(parseInt(process.env.HASH_SALT_ROUNDS)); 

    this.password = await bcrypt.hash(this.password, salt);

})


//create a method on the object itself, this is called mongoose instance methods.
userSchema.methods.createJWT = function() {
    const token = jwt.sign({_id: this._id, name: this.name }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
    return token;
}

//check if input password is correct for login
userSchema.methods.verifyPassword = async function(inputPassword) {

    const isMatch = await bcrypt.compare(inputPassword, this.password);

    return {
        isMatch
    };
}

const User = new mongoose.model('User', userSchema);
module.exports = User;

