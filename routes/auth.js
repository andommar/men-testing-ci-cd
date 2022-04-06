const router = require ('express').Router();
const User = require ('../models/user');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');


const {registerValidation, loginValidation} = require('../validation');
//routes
//registration
router.post("/register", async (req, res) => { //async to wait the API or the database
    //code

    //validate user input (name, email, password)
    const { error } = registerValidation(req.body);

    if(error){ //if hteres an error we send a error code and
        return res.status(400).json({error:error.details[0].message})
    }

    //check if email is already registered

    const emailExist = await User.findOne({ email: req.body.email});

    if(emailExist) {
        return res.status(400).json({error: "Email already exists"})
    }

    //hash password (bcrypt)

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    //create user object and save in DB

    const userObject = new User({
        name:req.body.name,
        email:req.body.email,
        password
    });

    try{
        const savedUser = await userObject.save();
        res.json({error: null, data: savedUser._id}) //returns the saved user Id
    } catch (error) {
        res.status(400).json({error})
    }
});


//login
router.post("/login", async(req, res)=>{
    
    //validate user login info
    const {error} = loginValidation(req.body);

    if(error){ //if hteres an error we send a error code and
        return res.status(400).json({error:error.details[0].message})
    }

    //if login info is valid, find the user
    const user = await User.findOne({ email: req.body.email});

    //throw error if email is wrong
    if(!user) {
        return res.status(400).json({error: "Email is wrong"})
    }
    //user exists -- check for password
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    //throw error if password is wrong
    if(!validPassword) {
        return res.status(400).json({error: "Password is wrong"})
    }
    //create authentication token with username and id
    const token = jwt.sign //creates a new token
    (
        {
            name: user.name,
            id: user._id,
        },
        //TOKEN_SECRET
        process.env.TOKEN_SECRET,
        //EXPIRATION TIME
        { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    //attach auth token to header
    res.header("auth-token", token).json({
        error:null,
        data: { token }
    })

    //payload



    //attach auth token to header






    //return res.status(200).json({msg: "Login route..."});
})

module.exports = router;