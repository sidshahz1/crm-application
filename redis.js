const redis = require('redis')


const redisClient = redis.createClient()

// redisClient.del("q:job", () => {
//   redisClient.quit()
// })

redisClient.flushall()
// console.log(redisClient);
redisClient.KEYS("*" , (err,result)=>{
  console.log(result)
})