// @@ Checks the validity of a token, to be used as middleware on some certain routes

const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../models/tokenBlacklist')

const checkToken = async function(req, res, next){
  try {

    var tokenBearer = req.headers.authorization;
    if(!req.headers.authorization){
      throw "There is no auth header on this request."
    }
    var split = tokenBearer.split(' ');
    var token = split[1];

    var check = await tokenBlacklist.find({ token: token });
    if(check.length > 0){
      throw "The auth token on this request is blacklisted.  Please try logging in again."
    }

    var isValid = await jwt.verify(token, process.env.JWT_SECRET);

    if(isValid){
      next();
    } else{
      throw "You do not have permission to access this data."
    }
  } catch(err){
    res.send({error: `${err}`})
  }
}

module.exports = checkToken;