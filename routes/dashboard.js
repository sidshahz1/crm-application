const express = require('express');
const route = express.Router();

//middleware funtions to handle validations
const{
    customerDataValidator,
    mailDataValidator
}= require('./dashboard/dashboard.validator');

//functions to handle request and generate output
const{
    dashboardData,
    addcustomer,
    updateCustomerInfo,
    deleteCustomer,
    customerContact,
    sendMail
}= require('./dashboard/dashboard.controller');

// fucntion to check if user logged in
const {authenticate} =  require('../auth/authentication');

//get route for dashboard setup
route.get('/:i?',authenticate,dashboardData);

//post route to add customer data
route.post('/addCustomer',authenticate,customerDataValidator,addcustomer);

//post route to update customer data
route.post('/updateCustomer',authenticate,customerDataValidator,updateCustomerInfo);

//route to delete customer data
route.get('/deleteCustomer/:id',deleteCustomer);

//route to get crm page
route.get('/crm/:id',authenticate,customerContact);

//route to send mail
route.post('/crm/sendMail',authenticate,mailDataValidator,sendMail);

module.exports = route;