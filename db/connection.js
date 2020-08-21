const pg = require('pg');

const connectionString = 'postgresql://sid:db1234@localhost/crm';
const client = new pg.Client({
    connectionString: connectionString,
})
client.connect((err)=>{
    if(err){
        console.log(err); 
        console.log("db connection error");
    }
    else{
        console.log(" database connected.");
    }
});

module.exports= client;