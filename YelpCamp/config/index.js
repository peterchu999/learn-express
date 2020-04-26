const dotenv = require('dotenv')
dotenv.config()

module.exports ={
    port: process.env.PORT,
    dbUrl: process.env.DBURL,
    ip: process.env.IP
}