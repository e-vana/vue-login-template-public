let mongoose = require('mongoose');

let tokenBlacklistSchema = mongoose.Schema({
  dateAdded: {
    type: Date,
    required: true
  },
  token: {
    type: String,
    required: true
  }
})



let tokenBlacklist = module.exports = mongoose.model('tokenBlacklist', tokenBlacklistSchema);