const { body } = require("express-validator");

//validators for request variables
const validators= {
    customerDataValidator: [
        body("name").notEmpty(),
        body("email","invalid email").notEmpty().isEmail(),
        body("phone","phone no should be 10 digits").notEmpty().isNumeric().isLength({min: 10},{max: 10}),
        body("address").notEmpty(),
        body("frequency").notEmpty().isNumeric(),
        body("gst").notEmpty()
    ],
    mailDataValidator: [
        body("subject").notEmpty(),
        body("message").notEmpty()
    ]
}

module.exports= validators;