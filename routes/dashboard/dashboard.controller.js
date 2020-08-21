const moment = require('moment');
const { validationResult } = require('express-validator');
const client = require('../../db/connection');

const{
    mail
}= require('./dashboard.service');

var queue= require('./dashboard.schedular');

//funtion to send dashboard data along with errors if any
const dashboardData = async (req,res)=>{
    try{
        // let info = {
        //     name: req.name,
        //     email: req.email
        // }
        const text = 'Select * from customers where userid = $1';
        const values  = [req.session.userId];
        result = await client.query(text,values);
        let errors= null;
        if(req.session.error){
            errors = req.session.error;
            req.session.error=null;
        }
        res.render('dashboard.ejs', {customers: result.rows, current: req.params.i,error:errors});
    }
    catch(err){
        console.log(err);
        res.redirect('/registration/logout');
    }
}

// function to add new customer 
const addcustomer = async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.errors);
        req.session.error = errors.errors;
        res.redirect('/dashboard');
    }
    else{
        try{
            let {name, email, phone, address, frequency, gst} = req.body;
            var currentUser = req.session.userId;
            const text = 'INSERT INTO customers(name, email, phone, address, frequency,gst, userid) VALUES($1, $2, $3,$4, $5, $6, $7) RETURNING *'
            const values = [name, email, phone, address, frequency, gst, currentUser];
            result = await client.query(text,values);
            console.log("new id- ",result.rows[0].id);

            var job1= queue.createJob('message',{
                to: email,
                from: req.name,
                senderid:currentUser,
                receiverid:result.rows[0].id
            }).unique(result.rows[0].id).priority('normal');
            queue.every(`*/${frequency} * * * * *`,job1);


            res.redirect('/dashboard');
        }
        catch(err){
            console.log(err);
            req.session.error = [{msg: "internal server error, try again"}];
            res.redirect('/dashboard');
        }
    }
}

// function to update customer data
const updateCustomerInfo = async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.errors);
        req.session.error = errors.errors;
        res.redirect('/dashboard');
    }
    else{
        try{
            let {id, name, email, phone, address,gst, frequency} = req.body;
            const text = 'update customers set name = $1, email= $2, phone= $3, address = $4, frequency= $5, gst =$7 where id= $6'
            const values = [name, email, phone, address, frequency,id, gst];
            result = await client.query(text, values);

            queue.removeJob({unique: id},(err,res)=>{
                console.log(res);
            });
            var job1= queue.createJob('message',{
                to: email,
                from: req.name,
                senderid:req.session.userId,
                receiverid:id
            }).unique(id).priority('normal');
            queue.every(`*/${frequency} * * * * *`,job1);

            res.redirect('/dashboard');
        }
        catch(err){
            console.log(err);
            req.session.error = [{msg: "internal server error, try again"}];
            res.redirect('/dashboard');
        }
    }
}

//function to delete customer
const deleteCustomer = async (req,res)=>{
    try{
        const text = 'delete from customers where id = $1'
        const values = [req.params.id];
        result  = await client.query(text, values);
        res.redirect('/dashboard');
    }
    catch(err){
        console.log(err);
        req.session.error = [{msg: "internal server error, try again"}];
        res.redirect('/dashboard');
    }
}

const customerContact = async (req,res)=>{
    try{
        var customerId = req.params.id;
        text = "select * from customers where id = $1";
        values = [customerId];
        result = await client.query(text,values);
        text= "select * from conversations where senderid= $1 and receiverid= $2";
        values= [req.session.userId, customerId];
        messages=await client.query(text,values);
        res.render('crm.ejs',{data:result.rows[0],messages: messages.rows,error:null});
    }
    catch(err){
        console.log(err);
    }
}

const sendMail = async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.errors);
        // req.session.error = errors.errors;
        res.redirect('/dashboard');
    }
    else{
        try{
            let {subject, message, receiverid, email} = req.body;
            senderid = req.session.userId;
            sender = req.name;
            var now= moment();
            mailResult = await mail(email,subject,message,sender);
            const text = 'INSERT INTO conversations(senderid, receiverid, subject, message, time) VALUES($1, $2, $3,$4, $5) RETURNING *'
            const values = [senderid, receiverid , subject, message, now];
            result = client.query(text,values);
            res.redirect('/dashboard/crm/'+receiverid);
        }
        catch(err){
            console.log(err);
        }
    }
}

module.exports= {dashboardData,addcustomer,updateCustomerInfo, deleteCustomer,customerContact,sendMail};