const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const upload = require('../middleware/upload');

const JWT_SECRET = 'Harashisgoodboy';

// ROUTER: 1 Create a User using: POST "/api/auth/createuser" - No login required
router.post('/createuser', upload.single("image"), [
    body('name', 'Enter a valid name').isLength({min: 3}),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({min: 5})
], async (req, res) =>{
    let success = false;
    //If there are errors, return Bad request and the errrors
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({success, errors: errors.array()});
    }

    //check wheather the user with this email exists already
    try{
    let user = await User.findOne({email: req.body.email});
    if (user){
        return res.status(400).json({success, error: "Sorry a user with this email already exist"})
    }

    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        profileImage: req.file ? `uploads/${req.file.filename}` : ""
    })
    // .then(user => res.json(user))
    // .catch(err => {console.log(err)
    // res.json({error: 'please enter a unique value for email', message: err.message})})

    const data = {
        user:{
            id: user.id
        }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);

    // res.json(user)
    success = true;
    res.json({success, authtoken})
}
catch(error){
    console.error(error.message);
    res.status(500).send("Intenal sever Error");
}
})

// ROUTER: 2 Authenticate auser using: POST"/api/auth/login" - No login require

router.post('/login',[
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password can not be blank').exists()
], async (req, res) =>{
    let success = false;
    //If there are errors, return Bad request and the errrors
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

//destructuring
const {email, password} = req.body;
try {
    let user = await User.findOne({email});
    if(!user){
        success = false;
        return res.status(400).json({error: "Please try to login with correct credentials"});
    }
    const  passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare){
        success = false;
        return res.status(400).json({success, error: "please try to login with correct credentials"});
        
    }
    const data = {
        user:{
            id: user.id
        }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({
      success: true,
      authtoken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage // 🔥 THIS LINE FIXES IMAGE ISSUE
      }
    });
} catch(error){
    console.error(error.message);
    res.status(500).send("Intenal sever Error");
}
})

// ROUTER: 3 Get loggedin user Details using: POST"/api/auth/getuser" - Login required
router.post('/getuser', fetchuser, async (req, res) =>{
try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user)
} catch (error) {
    console.error(error.message);
    res.status(500).send("Intenal sever Error");
}
})
module.exports = router