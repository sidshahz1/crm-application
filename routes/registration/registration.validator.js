const { body } = require("express-validator");
const client = require('../../db/connection');

//validators for request variables
const validators= {
    signUpValidation: [
        body("name").notEmpty(),
        body("email").notEmpty().isEmail().custom(value=>{
            const text = 'select * from users where email= $1';
            const values=[value];
            return client.query(text,values).then(result=>{
                if(result.rowCount!=0){
                    return Promise.reject("E-mail already in use");
                }
            })
        }),
        body("password","min password length=4").notEmpty().isLength({min: 4})
    ],
    otpValidation: [
        body("otp").notEmpty().isLength({max:4},{min:4}).isNumeric()
    ],
    logInValidation: [
        body("email").notEmpty().isEmail(),
        body("password").notEmpty().isLength({min: 4})
    ]
}

module.exports= validators;