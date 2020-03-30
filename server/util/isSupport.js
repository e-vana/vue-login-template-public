const jwt = require('jsonwebtoken');


const isSupport = async function(req, res, next){
  try {

    //This token will be on a request header, hardcoded for test right now

    var tokenBearer = req.headers.authorization;
    var split = tokenBearer.split(' ');
    var token = split[1];
    var isValid = await jwt.verify(token, process.env.JWT_SECRET);
    
    if((isValid.isSupport == true) || (isValid.isAdmin == true)){
      next();
    } else{
      throw "You do not have the permissin level to access this data."
    }
  } catch(err){
    res.send({error: `${err}`})
  }
}


module.exports = isSupport;