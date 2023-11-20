const express = require('express')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const User = require('./models/userProfile')

app.use(session({
    secret:'your secret key',
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(
    (username, password, done) => {
        User.findOne({username:username},(err,user) =>{
            if(err) return done(err)
            if(!user) return done(null,false,{message:'incorrect username.'})
            if(!bcrypt.compareSync(password,user.password)){
                return done(null,false,{message:'incorrect password'})
            }
            return done(null,user)

        })
    }
))

passport.serializeUser((user,done) => {
    done(null,user.id)
})
passport.deserializeUser((id,done) => {
    User.findOne(id,(err,user) => {
        done(err, user)
    })
})

function isAuthenticated(req,res,next) {
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}



app.get('/protected',isAuthenticated, (req,res) => {
    res.send('This is protected route')
})