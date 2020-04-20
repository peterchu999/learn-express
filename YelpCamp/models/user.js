const passportLocalMongoose = require('passport-local-mongoose')
const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username: String,
    password: String
})
userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', userSchema)