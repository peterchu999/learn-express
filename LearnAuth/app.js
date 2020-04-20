const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportLocalMongoose = require('passport-local-mongoose')
const expressSession = require('express-session')
const User = require('./models/user')

mongoose.connect('mongodb://localhost/auth_demo', {useNewUrlParser: true,  useUnifiedTopology: true })
const app = express()
const port = 3000
app.use(expressSession({
    secret: "Peter just learn express",
    resave: false,
    saveUninitialized: false
}))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}



//===================
//ROUTE
//===================
app.get('/api', (req,res) => {
    res.status(200).json({
        name: 'developer',
        user: req.isAuthenticated()
    })
})
app.get('/',(req, res) => {
    res.render('home',{user: req.user})
})

app.get('/secret',isLoggedIn ,(req, res) => {
    res.send("Sitll Learrning Broo")
})
//==================
//Auth Routes
//==================
app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    const {username, password} = req.body
    User.register(
        new User({username: username}), 
        password,
        (err, user) => {
            if (err) {
                console.log(`error to create user : ${err}`)
                return res.render('register')
            }
            passport.authenticate('local')(req, res, () => {
                res.redirect('/secret');
            })
        }
    )
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
}) ,(req, res) => {
})

app.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

app.listen(port,() => {
    console.log(`server starting at :  http://localhost:${port}`)
})