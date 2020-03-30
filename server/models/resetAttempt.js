let mongoose = require('mongoose');

let resetAttemptSchema = mongoose.Schema({
  dateAttempted: {
    type: Date,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  expirationDate: {
    type: Date,
    required: true
  }
})



let resetAttempt = module.exports = mongoose.model('resetAttempt', resetAttemptSchema);