// import modules
const express = require("express");
const bodyparser= require('body-parser');
const session = require('express-session');

//start the express app
const app= express();

// set view engine to ejs
app.set('views engine', 'ejs');

//set middleware functions
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use(session({
    secret: "session_secret",
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 3600000,
    }
}))

//logger to save all log data to a file
var logger = require('./config/logger');

var registration = require('./routes/registration');
var dashboard = require('./routes/dashboard');

//different routes
app.use('/registration',registration);
app.use('/dashboard',dashboard);

//default route
app.get('*',(req,res)=>{
    res.redirect('/registration/login');
})

var queue = require('./routes/dashboard/dashboard.schedular');
const {autoMail} = require('./routes/dashboard/dashboard.service');
const client = require('./db/connection');
queue.process('message',async (job,done)=>{
    logger.info("sending mail to- ", job.data.to);
    try{
        text = "select * from conversations where senderid= $1 and receiverid= $2";
        values= [job.data.senderid, job.data.receiverid];
        data = await client.query(text,values);
        result  = await autoMail(job.data.to,data.rows,job.data.from);
    }
    catch(err){
        logger.info(err);
    }
    finally{
        done();
    }
})


// start the server
app.listen(3000, ()=>{
    console.log("server running... ");
})