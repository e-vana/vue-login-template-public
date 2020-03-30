let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
  dateJoined: {
    type: Date,
    required: true
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
  isRegistered: {
    type: Boolean,
    required: true,
    default: false
  },
  isConfirmed: {
    type: Boolean,
    required: true,
    defaulst: false
  },
  isLocked: {
    type: Boolean,
    required: true,
    default: false
  },
  isSupport: {
    type: Boolean,
    required: true,
    default: false
  }
})



let User = module.exports = mongoose.model('User', userSchema);