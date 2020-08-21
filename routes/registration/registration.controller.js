const { validationResult } = require('express-validator');
const client = require('../../db/connection');

// require all helper funstions
const{
    sendMail
}= require('./registration.services');
const logger = require('../../config/logger');


//function to handle add user request
const addUser = async(req,res)=>{
    logger.info("call to adduser route");
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        logger.info("validation error in add user function- ",errors.errors);
        res.render('signup.ejs',{error: errors.errors});
    }
    else{
        try{
            var name = req.body.name;
            var email = req.body.email;
            var password = req.body.password;
            var otp =Math.floor(1000 + Math.random() * 9000);
            const text = 'INSERT INTO users(name, email, password, otp) VALUES($1, $2, $3, $4) RETURNING *';
            const values = [name, email, password, otp];
            result =await client.query(text,values);
            mailInfo =await sendMail(email,otp);
            logger.info("sending otp- ",otp);
            res.render('otp.ejs',{email:email,error:null});
        }
        catch(err){
            logger.info("error caugth in add user route- ",err);
            res.render('signup.ejs',{error:[{msg: "internal server error"}]});
        }
    }
}

// function to handle verify otp request
const verifyOtp = async (req,res)=>{
    logger.info("call to verify otp route");
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        logger.info("validation error in verify function- ",errors.errors);
        res.render('otp.ejs',{email:req.body.email ,error: errors.errors});
    }
    else{
        try{
            var email = req.body.email;
            var otp = req.body.otp;
            const text = 'select * from users where email= $1 and otp= $2';
            const values=[email,otp];
            result = await client.query(text, values);
            if(result.rowCount==1){
                const text = 'update users set isverified = $1 where id= $2';
                const values=[true,result.rows[0].id];
                updatedResult = client.query(text,values);
                req.session.userId = result.rows[0].id;
                console.log("user logged in",req.session.userId);
                logger.info("otp verified redirecting to dashboard ");
                res.redirect('/dashboard');
            }
            else{
                logger.info("otp invalid, redirecting to signup ");
                res.render('signup.ejs',{error:[{msg: "incorrect otp"}]});
            }
        }
        catch(err){
            logger.info("error caugth in verify otp route- ",err);
            res.render('otp.ejs',{email: req.body.email,error:[{msg: "internal server error, try again"}]});
        }
    }
}

//function to handle user login request
const logInUser = async (req,res)=>{
    logger.info("request for user login");
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        logger.info("validation error in login user route- ",errors.errors);
        res.render('login.ejs',{error: errors.errors});
    }
    else{
        try{
            var email = req.body.email;
            var password = req.body.password;
            const text = 'select * from users where email= $1 and password= $2 and isverified = $3';
            const values=[email,password,true];
            result = await client.query(text,values);
            if(result.rowCount==1){
                req.session.userId = result.rows[0].id;
                logger.info("user logged in",req.session.userId);
                res.redirect('/dashboard');
            }
            else{
                logger.info("incorrect login credential ");
                res.render('login.ejs',{error:[{msg: "incorrect login credentials, try again"}]});
            }
        }
        catch(err){
            logger.info("error caugth in login user route- ",err);
            res.render('login.ejs',{error:[{msg: "internal server error, try again"}]});
        }
    }
}

//function to handle user logout request
const logout = async (req,res)=>{
    try{
        await req.session.destroy();
        logger.info("user logout");
        res.redirect('/');
    }
    catch(err){
        logger.info("error caugth in logout user route- ",err);
        res.redirect('/dashboard');
    }
}

module.exports = {addUser, verifyOtp,logInUser,logout};