const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const cors = require('cors');
const checkToken = require("./util/checkToken");
const serveStatic = require('serve-static')
const path = require('path')



require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// @@ Router Route locations
app.use('/api/users', require('./routes/users'));
app.use('/api/account', require('./routes/accountManagement'));
app.use('/api/support', require('./routes/customerSupport'));


//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization");
  next();
});


//Serves front end distribution files on build
app.use('/', serveStatic(path.join(__dirname, '../client/dist')))

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function (req, res) {
	res.sendFile(path.join(__dirname, '../client/dist/index.html'))
})

//Setup Server
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }).then(
  () => {
    console.log("Database connected...")

    //process.env.PORT is for Heroku port assignment.
    app.listen(process.env.PORT || port, ()=> {
      if(process.env.PORT){
        console.log(`App started on port ${process.env.PORT}`)
      } else {
        console.log(`App started on port ${port}`)
      }
    })
  },
  err => {
    console.log(err)
  }
);