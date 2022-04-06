const Joi = require('joi'); //library to validation
const jwt = require ('jsonwebtoken');


// validating registration
const registerValidation = (data) => {
    const schema = Joi.object(
        {
            name: Joi.string().min(6).max(255).required(), //validates string of min 6 chars, 255 chars and that is required
            email: Joi.string().min(6).max(255).required(), 
            password: Joi.string().min(6).max(255).required(), 
        }
    );

    return schema.validate(data);
}
// validating login
const loginValidation = (data) => {
    const schema = Joi.object(
        {
            email: Joi.string().min(6).max(255).required(), 
            password: Joi.string().min(6).max(255).required()
        }
    );

    return schema.validate(data);
}

//logic to verify token (JWT)
const verifyToken = (req, res, next) => {
    const token = req.header("auth-token");

    if(!token) return res.status(401).json({error: "Access Denied"});

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next(); //if everything is correct we pass it to the next route

    }
    catch(error)
    {
        res.status(400).json({error: "Token is not valid"});
    }
}

module.exports = {registerValidation, loginValidation, verifyToken};