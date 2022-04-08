if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const express = require("express")
const cookieParser = require("cookie-parser")
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const User = require('./models/user')

// routes
const indexRouter = require('./routes/index')
const shoppinglistRouter = require('./routes/einkaufszettel')

// database connection
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))


app.set('view-engine', 'ejs')
app.use(cookieParser())
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json({extended: false}))
app.use(flash())
app.use(session({
  // Change Secret to Cookie?!
  secret: process.env.SESSION_SECRET,
  cookie: { path: '/', httpOnly: true, maxAge: 36000000},
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))



// app use routes
app.use('/', indexRouter)
app.use('/shoppinglist', shoppinglistRouter)



app.listen(3000)