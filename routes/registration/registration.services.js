const nodemailer = require('nodemailer');

//create transporter for sendin mail using nodemailer
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sidshah934@gmail.com',
        pass: '@lebhulgy@'
    }
});

//function to send mail
const sendMail =async (email,otp)=>{
    var mailOptions = {
        from: 'sidshah934@gmail.com',
        to: email,
        subject: "otp",
        text: "your otp is:"+otp
    };
    info = transporter.sendMail(mailOptions);
    return info;
}

module.exports ={sendMail};