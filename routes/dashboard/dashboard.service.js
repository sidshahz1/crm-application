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
const mail =async (email,subject,message,sender)=>{
    var mailOptions = {
        from: 'sidshah934@gmail.com',
        to: email,
        subject: subject,
        html: "<h4>new mail from: "+sender+"</h4><hr> <p>Message: "+message+"</p>"
    };
    info =await transporter.sendMail(mailOptions);
    return info;
}

//function to mail all conversations
const autoMail =async (email,data,sender)=>{
    let htmldata = "<h4>new mail from: "+sender+"</h4><hr><table><tr><td>time</td><td>subject</td><td>message</td></tr>";
    data.forEach(element => {
        htmldata+="<tr>";
        htmldata+="<td>"+element.time+"</td>";
        htmldata+="<td>"+element.subject+"</td>";
        htmldata+="<td>"+element.message+"</td>";
        htmldata+="</tr>";
    });
    htmldata+="</table>";
    var mailOptions = {
        from: 'sidshah934@gmail.com',
        to: email,
        subject: "automated conversation history mail",
        html: htmldata
    };
    info =await transporter.sendMail(mailOptions);
    return info;
}

module.exports ={mail,autoMail};