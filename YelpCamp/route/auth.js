const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    const {username, password} = req.body
    User.register(
        new User({username: username}),
        password,
        (err, user) => {
            if (err) {
                console.log(`regis error : ${err}`)
                req.flash('error', `${err}`)
                res.redirect('/register')
            }
            passport.authenticate('local')(req, res, () => {
                req.flash('success', 'Successfuly Registered')
                res.redirect('/');
            })
        }
    )
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('local', { 
    successRedirect: '/', 
    failureRedirect: '/login',
    successFlash: true
}), (req, res) => {      
    req.flash('success', 'Successfuly Login')  
})

router.get('/logout', (req, res) => {
    req.flash('success', 'You have log out')
    req.logout()
    res.redirect('/')
})

module.exports = router
