const passport = require('passport')
const initPassport = require('../module/passport-config')
const db = require('../module/mongoose-functions')

// init passport
initPassport (
  passport, 
  // find email and id in database
  db.findUserByMail,
  db.findUserById
)

const checkAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/login')
}

const checkNotAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()){
    return res.redirect('/')
  } 
  next()
}

module.exports = { checkAuthenticated, checkNotAuthenticated, passport}