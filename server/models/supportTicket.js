let mongoose = require('mongoose');

let supportTicketSchema = mongoose.Schema({
  dateSubmitted: {
    type: Date,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  priority: {
    type: Number,
    required: true,
    default: 0
  },
  comment: {
    type: String,
    required: true
  },
  resolved: {
    type: Boolean,
    required: true,
    default: false
  },
  assignedTo: {
    type: String,
    required: false
  }
})



let supportTicket = module.exports = mongoose.model('supportTicket', supportTicketSchema);