// setup express router
const express = require('express');
const route = express.Router();

//middleware funtions to handle validations
const{
    signUpValidation,
    otpValidation,
    logInValidation
}= require('./registration/registration.validator');

// functions to handle request and generate output
const{
    addUser,
    verifyOtp,
    logInUser,
    logout
}= require('./registration/registration.controller');

// function to check if user already logged in
const {redirectHome} =  require('../auth/authentication');

// get route fot login page
route.get('/login',redirectHome,(req,res)=>{
    res.render('login.ejs',{error:null});
})

//get route for signup page
route.get('/signup',redirectHome,(req,res)=>{
    res.render('signup.ejs',{error: null});
})

//post route to to complete user signup
route.post('/signup',redirectHome,signUpValidation,addUser);

//post route to handle otp validation
route.post('/otp',redirectHome,otpValidation,verifyOtp);

//post route to log user in
route.post('/login',redirectHome,logInValidation,logInUser);

//get route to log user out
route.get('/logout',logout);

module.exports=route;