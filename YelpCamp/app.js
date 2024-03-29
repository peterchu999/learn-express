const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportLocalMongoose = require('passport-local-mongoose')
const expressSession = require('express-session')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const {port, ip, dbUrl} = require('./config')
const MongoStore = require('connect-mongo')(expressSession)


const app = express()

const authRouter = require('./route/auth')
const viewRouter = require('./route/view')
const campgroundRouter = require('./route/campground')
const commentRouter = require('./route/comment')

const User = require('./models/user')

mongoose.connect(dbUrl, {useNewUrlParser: true, useCreateIndex: true, 
useUnifiedTopology: true }).then(() => {console.log("connect to db!!")}).catch( err => {console.log(`error: ${err}`)})

app.set('view engine', 'ejs')
app.use(flash())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(expressSession({
    secret: 'YelpCamp',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    next()
})

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to login to do that')
    res.redirect('/login')
}

app.use('/', viewRouter)
app.use('/', authRouter)
app.use('/campgrounds', isLoggedIn, campgroundRouter)
app.use('/campgrounds/:id/comments', isLoggedIn, commentRouter)

app.use('/notify', notifyRouter)

app.listen(port, () => {
    console.log(`Starting server at ${ip}:${port}`)
})