const client = require('../db/connection');

const authenticate = (req,res,next)=>{
    if(!req.session.userId){
        res.redirect('/');
    }
    else{
        const text = 'select * from users where id= $1';
        const values=[req.session.userId];
        client.query(text,values,(err,result)=>{
            if(err){
                console.log(err);
                next();
            }
            else{
                req.name = result.rows[0].name;
                req.email = result.rows[0].email;
                next();
            }
        })
    }
}

const redirectHome = (req,res,next)=>{
    if(req.session.userId){
        res.redirect('/dashboard');
    }
    else{
        next();
    }
}

module.exports = {authenticate,redirectHome};