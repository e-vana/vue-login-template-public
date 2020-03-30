//Setup imports
const express = require('express');
const router = express.Router();
const User = require("../models/user");
const supportTicket = require("../models/supportTicket"); 

const tokenBlacklist = require("../models/tokenBlacklist");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

//Util Functions
const catchErrors = require("../util/catchErrors");
const isAdmin = require("../util/isAdmin");
const isSupport = require("../util/isSupport");
const checkToken = require("../util/checkToken");

//CORS
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization");
  next();
});

// @@ Makes a new support ticket
router.post('/ticket', catchErrors(async(req, res) => {
  var newTicket = new supportTicket({
    dateSubmitted: Date.now(),
    userEmail: req.body.userEmail,
    username: req.body.username,
    comment: req.body.comment
  })

  var saveTicket = await newTicket.save();
  if(!saveTicket){
    console.log("There was an issue submitting this ticket.")
    throw { message: "There was an issue submitting this ticket."}
  }
  res.send(saveTicket);
}));

// @@ Fetch all tickets, closed or not
router.get('/all-tickets', isSupport, catchErrors(async(req, res) => {
  var allTickets = await supportTicket.find();
  if(!allTickets.length){
    throw { message: "No tickets found."}
  }
  res.send(allTickets);
}));

// @@ Fetch all OPEN tickets
router.get('/open-tickets', isSupport, catchErrors(async(req, res) => {
  var allTickets = await supportTicket.find({ resolved: false});
  if(!allTickets.length){
    throw { message: "No tickets found."}
  }
  res.send(allTickets);
}));

// @@ Fetch all OPEN tickets with HIGH PRIORITY
router.get('/open-tickets-high', isSupport, catchErrors(async(req, res) => {
  var allTickets = await supportTicket.find({ resolved: false, priority: { $gt : 3 }} );
  if(!allTickets.length){
    throw { message: "No tickets found."}
  }
  res.send(allTickets);
}));

// @@ Fetch all CLOSED tickets
router.get('/resolved-tickets', isSupport, catchErrors(async(req, res) => {
  var allTickets = await supportTicket.find({ resolved: true});
  if(!allTickets.length){
    throw { message: "No tickets found."}
  }
  res.send(allTickets);
}));

// @@ Fetch a particular ticket with ID
// Finds ticket ID based on param
router.get('/ticket/:id', isSupport, catchErrors(async(req, res) => {
  var allTickets = await supportTicket.findById(req.params.id)
  if(!allTickets){
    throw { message: "No ticket with corresponding ID found."}
  }
  res.send(allTickets);
}));

// @@ Fetch a particular Ticket assigned to a ID
router.get('/ticket/assigned-to/:id', isSupport, catchErrors(async(req, res) => {
  var ticketAssignedTo = await supportTicket.find({ assignedTo: req.params.id});
  if(!ticketAssignedTo.length){
    throw { message: "No Tickets assigned to this ID."}
  }
  res.send(ticketAssignedTo);
}));

// @@ Update the priority of a ticket
// requires body paramater "priority: "newPriority#"
router.post('/ticket/change-priority/:id', isSupport, catchErrors(async(req, res) => {
  var ticket = await supportTicket.findById(req.params.id);
  if(!ticket){
    throw { message: "Failed to find a ticket with this ID number."}
  }
  ticket.priority = req.body.priority;
  var save = await ticket.save();
  if(!save){
    throw { message: `Failed to change priority on ticket ${req.body.id}`}
  }
  res.send(`Ticket ${req.params.id} priority succesfully changed.`)

}))

module.exports = router;
