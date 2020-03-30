//Setup imports
const express = require('express');
const router = express.Router();
const User = require("../models/user");
const resetAttempt = require("../models/resetAttempt");

const tokenBlacklist = require("../models/tokenBlacklist");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

//Util Functions
const catchErrors = require("../util/catchErrors");
const isAdmin = require("../util/isAdmin");
const checkToken = require("../util/checkToken");
const sendResetPasswordEmail = require("../util/sendResetPasswordEmail");
const sendConfirmationEmail = require('../util/sendConfirmationEmail');

//CORS
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization");
  // res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  next();
});


// @@ Register a new account
router.post('/register', catchErrors(async (req, res) => {
  const user = await User.find({username: req.body.username});
  if(user.length > 0){
    throw { message: "An account with this username already exists."}
  } else {

    const emailExists = await User.find({email: req.body.email});
    if(emailExists.length > 0){
      throw { message: "There already exists an account registered with this email address."}
    } else {

      const saltValue = await bcrypt.genSaltSync(10);
      const hashed = await bcrypt.hashSync(req.body.password, saltValue);
    
      const newUser = new User({
        dateJoined: Date.now(),
        username: req.body.username,
        password: hashed,
        email: req.body.email,
        isRegistered: true,
        isConfirmed: false
      })
    
      var addUser = await newUser.save();
      console.log(addUser);
      // send a confirmation email
      var confirmEmail = await sendConfirmationEmail(req.body.email, addUser._id);
      if(addUser){
        res.send(addUser)
      } else {
        throw { message: "There was a problem saving this user to the database."}
      }
    }
  }
}))

router.get('/confirmed-email/:id', catchErrors(async(req, res)=>{ 
  const user = await User.findOne({ _id: req.params.id});
  if(!user){
    throw { message: "Cannot find specified user."}
  }
  if(user.isConfirmed==true){
    res.status(200).json({isConfirmed: true})
  } else {
    res.status(200).json({isConfirmed: false})
  }
}))

router.get('/confirm-email/:id', catchErrors(async(req, res)=> {
  const user = await User.findOne({_id: req.params.id});
  console.log(user);
  if(user.isConfirmed==true){
    res.status(200).json({message: "This user is already confirmed."})
  } else {
    user.isConfirmed = true;
    user.save();
    res.send(user);
  }
}))

router.get('/unconfirm-email/:id', catchErrors(async(req, res)=> {
  const user = await User.findOne({_id: req.params.id});
  if(user.isConfirmed==true){
    user.isConfirmed = false;
    user.save();
    res.send(user);
  } else {
    res.status(200).json({message: "Unconfirmed user email"})

  }
}))

router.post('/send-confirm-email-again/', catchErrors(async(req, res)=> {
  console.log(req.body);
  var confirmEmail = await sendConfirmationEmail(req.body.userEmail, req.body.userId);
  if(!confirmEmail){
    throw { message: "There was a problem sending another confirmation email."}
  }
  res.status(200).json({message: "Succesfully sent another confirmation email."})
}))

// @@ /login
// @@ Login with existing credentials username & password
router.post('/login', catchErrors(async(req, res) => {
  const user = await User.findOne({username: req.body.username});
  if(user){
    var correctPassword = await bcrypt.compareSync(req.body.password, user.password);
    if(correctPassword){

      var secret = process.env.JWT_SECRET;
      var token = await jwt.sign({username: user.username, email: user.email, isAdmin: user.isAdmin}, secret, { expiresIn: '24h' });
      res.status(200).json({
         token: token,
         userId: user._id,
         userEmail: user.email
         });
    } else {
      throw { message: "Incorrect password."}
    }
  } else {
    throw { message: "This account does not exist.  Please register to use this application."}
  }
}))

// @@ Signout and blacklist token
router.post('/signout', catchErrors(async(req, res) => {
  var check = await tokenBlacklist.find({ token: req.body.token });
  if(check.length > 0){
    throw { message: "This token has already been signed out and blacklisted."}
  }
  var blacklistToken = new tokenBlacklist({
    dateAdded: Date.now(),
    token: req.body.token
  })
  var newBlackListToken = await blacklistToken.save();
  if(newBlackListToken){
    res.status(200).json({
      message: "This user was succesfully signed out."
    })

  } else {
    throw { message: "Token was not added to blacklist."}
  }
}))


//$2b$10$VLIgNB4OEMrPMx0cmu/1XOh5dvdWHdrNu6rydOS573NVlIqF6mKTi






// @@ Get all users if admin
router.get('/all', isAdmin, catchErrors(async(req, res) => {
  //If you have a valid token, you'll see a list of all users
  var allUsers = await User.find().select("username _id email");
  if(allUsers){
    res.send(allUsers);
  } else {
    throw { message: "No Users found."}
  }
}))



router.post('/:id/change-permission/:permission-:value', isAdmin, catchErrors(async (req, res) => {
  //send json request for change
  var user = await User.findOne({ _id: req.params.id });
  if(user){

    var permission = req.params.permission;
    var value = req.params.value;
    if(typeof value == !Boolean){
      throw { message: "Invalid Value type"}
    }
    user[permission] = value;
    user.save();
    res.status(200).send(user);
  }
}))


// @@ Get a specific user
router.get('/:id', catchErrors(async (req, res) => {
  // var user = await User.findById(req.params.id).exclude("password", "V", "mealCredits");
  var user = await User.findOne({_id: req.params.id}).select("username _id email isAdmin isRegistered isSupport dateJoined isConfirmed")

  if(user){
    res.send(user);
  }else {
    throw `User with ${req.params.id} was not found.`
  }

}));

// @@ Get a specific user by ID to determine credits
// router.get('/user/:username', catchErrors(async (req, res) => {
//   var user = await User.find({ username: req.params.username});
//   if(user){
//     console.log(user[0].mealCredits);
//     res.send(`User has ${user[0].mealCredits} meal credits remaining`);
//   } else {
//     throw `User with ${req.params.username} was not found.`
//   }
// }))

module.exports = router;
