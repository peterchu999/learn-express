# Authenctication

we gonna use ```passport-local``` ,```passport-local-mongoose``` and ```express-session``` so install it using :

```sh
npm i passport
npm i passport passport-local
npm i passport passport-local-mongoose
npm i express-session
```

now import the module, in this case all configuration like express, body-parser or mongoose are expected to be install and imported beforehand

```sh
const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportLocalMongoose = require('passport-local-mongoose')
```

after that let make ```User``` model just like usual

```sh
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
})

module.exports = mongoose.model('User', UserSchema)
```

we need to use ```passport-local-mongoose``` in our user schema. it contain many function and configuration to help us with Auth
to use the passport-local-mongoose we can set is as plug-in.

```sh
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
})
UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', UserSchema)
```

we need to use `express-session` by following code :

```javascript
app.use(require('express-session')({
    secret: "[some text]", // will be used to decode and encode session
    resave: false,
    saveUnitialize: false
}))
```

now we need to set up the passport in our app.js by using this 2 code, be sure to add `express-session` before this code otherwise it will result in
`undebugable` error:

```sh
app.use(passport.initialize())
app.use(passport.session())
```



so passport will want to read or write the data in the session. in this case we will store our User data in the session
to set it up we need this 2 line of code :

```sh
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
```

the ``User`` come from our userModel as for the serialize and deserialize function was come from `passport-local-mongoose` that we set as plugin in our schema.


## Register
let assume the route to register is `/register` with `POST` method.

```javascript
app.post('/register', (req, res) => {
    const {username, password} = req.body  // getting input from body
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
```

User.register was the function made by `passport-local-mongoose` and it take 2 params :

```js
User.register(
    new User([insert all user attribute expect password]),
    password,
    callback func
)
```
.register will automatically search the username in the db if it already exists we can't have duplication and the req failed. then it encrypt the password into 2 part which is `hash` and `salt`. then after encrypt the password, it save the new user to database


## Login

let assume the route to login is `/login` with `POST` method.

```js
app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
}) ,(req, res) => {
})
```

we usually never have the third param in the app.post or get. now there is ``passport.authenticate`` which work as the middleware. and actually we can make our own middleware, just put it in the middle of path and callback func.

```js
passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
})
```
the middleware was quite clear actually. it will automatically take username and password from body and attempt to login. if correct it will redirect to `successRedirect` otherwise it will redirect to `failureRedirect`. but the new thing was `'local'` passport provide so many type of authentication like facebook, twitter or google. all it take just change the `'local'` to `'facebook'` or `'twitter'`. local means it is our own db username password. and this provided auth type was call `Strategy` we need to install different type of strategy depending on our need. now because we want to use local strategy we must include it in our app.js

``
const LocalStrategy = require('passport-local')
passport.use(new LocalStrategy(User.authenticate()))
``

## Logout

Logout was quite simple. we just need the code below to logout

``sh
app.get('/logout', (req, res) => {
    req.logOut() // just this one
    res.redirect('/')
})
``


## Middleware

we can make our own middleware like making usual function. it takes 3 params : `req` , `res` , `next`. and in this case we can check if our user was logged in or not by accessing ``req.isAuthenticated()``. and the code look like this:

```sh
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}
```


and this middleware just work like laravel ->auth() middleware. all we nedd to do was include this function in the middle of our route like this :

``sh
app.get('/secret', isLoggedIn ,(req, res) => {
    res.send("Sitll Learrning Broo")
})
``

we can get our Logged in user data by accessing ``req.user``, it will return the user ``id`` and ``username`` in our case. But if there are no user who is loggedin then the ``req.user`` value would be ``undefined``.

```sh
app.get('/',(req, res) => {
    res.render('home',{user: req.user})
})
```

##  Function that call on every route

in this case if you want all route get the ``user`` data you need to add ``req.user`` to every single route so that your tempalate can use it.
but here is solution we make a function (middleware) that called on every single route :

```js
app.use((req, res, next) => {
    res.locals.userData = req.user
    next() // go to next middleware (most cases route handler)
})
```
``res.local`` make what ever inside the `locals` available on every template in this case if our template need an user data they can simply access `userData`


