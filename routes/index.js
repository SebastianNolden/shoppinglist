const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const auth = require('../module/passport-init')

// homepage route
router.get('/', auth.checkAuthenticated, (req, res) => {
  res.cookie('user_id', req.user.user_id, {
    httpOnly: true,
    maxAge: 36000000
  })
  res.redirect('/shoppinglist')
})

router.post('/login', auth.checkNotAuthenticated, auth.passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

router.get('/login', auth.checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

router.get('/register', auth.checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

router.post('/register', auth.checkNotAuthenticated, async (req, res) => {
  let userMail = req.body.email
  userMail = userMail.toLowerCase()

  const users = await User.findOne({'email': {$eq: userMail}})

  // check if user email is already in database
  if (users){
    res.render('register.ejs', {
      errMessage: 'Error: E-Mail already taken.'
    })
  } else {
    // E-mail is not in the database --> create user
    const hashPW = await bcrypt.hash(req.body.password, 10)
    let user_id
    try {
      user_id = crypto.randomUUID()
    } catch (err) {
      console.log(err)
    }
    const user = new User({
      name: req.body.name,
      email: userMail,
      password: hashPW,
      user_id
    })

    try {
      const newUser = await user.save()
      res.redirect('/login')
    } catch (err) {
      res.render('register.ejs', {
        errMessage: 'Error creating User'
      })
    }
  }

})

router.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})


module.exports = router