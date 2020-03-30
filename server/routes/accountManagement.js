//Express
const express = require('express');
const router = express.Router();

//Models
const User = require("../models/user");
const resetAttempt = require("../models/resetAttempt");

//Other Imports
const bcrypt = require('bcrypt');

//Util Functions
const catchErrors = require("../util/catchErrors");
const checkToken = require("../util/checkToken");
const sendResetPasswordEmail = require("../util/sendResetPasswordEmail");

//CORS
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// @@ Change user password
// @@ If a user is knows their current password, let them change it
// @@ Send JSON username, password, newPassword
router.post('/change-password', catchErrors(async(req, res) => {
  const user = await User.findOne({username: req.body.username});
  if(user){
    var correctPassword = await bcrypt.compareSync(req.body.password, user.password);
    if(correctPassword){
      
      const saltValue = await bcrypt.genSaltSync(10);
      const hashed = await bcrypt.hashSync(req.body.newPassword, saltValue);
      var newPassword = await User.findOneAndUpdate({_id: user._id}, { password: hashed})

      if(newPassword){
        res.status(200).json({
          message: "Your password has been succesfully changed."
        })
      } else {
        throw { message: "Error changing password."}
      }
    } else {
      throw { message: "Incorrect password."}
    }
  } else {
    throw { message: "This account does not exist.  Please register to use this application."}
  }
}))

// @@ Reset user email
// @@ Allows a user to change their email address associated with their account.
// @@ requires { "username": "XXX", "password": "XXX", "newEmail": "XXX" }
router.post('/change-email', catchErrors(async(req, res) => {
  const user = await User.findOne({username: req.body.username});
  if(user){
    var correctPassword = await bcrypt.compareSync(req.body.password, user.password);
    if(correctPassword){
      
      var newEmail = await User.findOneAndUpdate({_id: user._id}, { email: req.body.newEmail})

      if(newEmail){
        res.status(200).json({
          message: `Your email has been succesfully changed to ${newEmail.email}.`
        })
      } else {
        throw { message: "Error changing email."}
      }
    } else {
      throw { message: "Incorrect password."}
    }
  } else {
    throw { message: "This account does not exist.  Please register to use this application."}
  }
}))


// @@ Reset Password Request
// @@ Sends an email to user with a forgotten password, DOESNT ACTUALLY RESET THE PASSWORD
// @@ requires { "email" : "XXX" }
router.post('/reset-password-request', catchErrors(async(req, res) => {
  //some logic to check existing reset attempts
  const findReset = await resetAttempt.find({userEmail: req.body.email});

  var newResetAttempt = new resetAttempt({
    dateAttempted: Date.now(),
    userEmail: req.body.email,
    expirationDate: Date.now() + 36000000
  });

  var saveAttempt = await newResetAttempt.save();
  if(saveAttempt){
    var sendEmail = await sendResetPasswordEmail(req.body.email, saveAttempt.id);
    if(sendEmail){
      res.status(200).json({
        message: `Succesfully sent a password reset request email to ${req.body.email}`
      })
    } else {
      throw { message: "Reset request error. Contact support."}
    }
  } else {
    throw  { message:"Failed to save resetAttempt to database." }
  }
}))

// @@ Reset Password
// @@ If a user succesfully follows the reset link from their email, reset their password.
// @@ requires { "resetAttemptId": "XXX", "newPassword": "XXX"}
router.post('/reset-password', catchErrors(async(req, res) => {

  var findRequestAttempt = await resetAttempt.findById(req.body.resetAttemptId);
  console.log(findRequestAttempt);
  if(findRequestAttempt === null){
    throw { message: "Failed to find a proper reset attempt.  If you have already used this link to change a password, you need to generate a new one with the Forgot Password form.  Please contact support."}
  }
  if(findRequestAttempt && (findRequestAttempt.expirationDate < Date.now())){
    throw { message: "Your email link has expired.  Please initiate a new password reset request." }
  }
  if(findRequestAttempt && (findRequestAttempt.expirationDate > Date.now())){
    var updateUserPassword = await User.find({ email: findRequestAttempt.userEmail})
    if(!updateUserPassword){
      throw { message: "User account was not found."}
    }

    const saltValue = await bcrypt.genSaltSync(10);
    const hashed = await bcrypt.hashSync(req.body.newPassword, saltValue);

    var updateUserPasswordAndSave = await User.findByIdAndUpdate(updateUserPassword[0], { password: hashed});
    //DELETE THE PASSWORD REQUEST CHANGE
    var deletedRequest = await resetAttempt.findByIdAndDelete(req.body.resetAttemptId);
    console.log("Deleted request.")
    if(!deletedRequest){
      throw { message: "Error deleting request." }
    }
    if(updateUserPasswordAndSave){
      res.status(200).json({
        message: "Your password has been succesfully updated."
      })
    } else {
      throw { message: "Password has failed to update."}
    }
  }
}))

module.exports = router;
