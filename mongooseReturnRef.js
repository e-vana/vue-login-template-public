//https://stackoverflow.com/questions/45172700/what-does-mongoose-return-when-a-find-query-is-empty

//------------------------------------------------------
//  FOR User.find(), exists if(users.length)                                  
//------------------------------------------------------
User.find({}, (err, users) => {
  // users is an array which may be empty for no results
  if (err) {
    // handle error
    return;
  }
  if (users.length) {
    // there are user(s)
  } else {
    // there are no users
  }
});


//------------------------------------------------------
//  FOR User.findOne(), exists if(user)                                   
//------------------------------------------------------
User.findOne({}, (err, user) => {
  // user is a single document which may be null for no results
  if (err) {
    // handle error
    return;
  }
  if (user) {
    // there is user
  } else {
    // there is no user
  }
});


//------------------------------------------------------
//  FOR User.findById(), exists if(user)                                   
//------------------------------------------------------
User.findById(id, (err, user) => {
  // user is a single document which may be null for no results
  if (err) {
    // handle error
    return;
  }
  if (user) {
    // there is user
  } else {
    // there is no user
  }
});