const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initPassport(passport, getUserByEmail, getUserByID){
  const authenticateUser = async (email, password, done) => {
    email = email.toLowerCase()
    const user = await getUserByEmail(email)
    if(user == null){
      return done(null, false, { message: 'No user with that email' })
    } 
    
    try {
      if(await bcrypt.compare(password, user.password)){
        return done(null, user)
      } else {
        // password wrong!
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (error) {
      return done(error)
    }
  }

  passport.use(new localStrategy({usernameField: 'email'}, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))

  passport.deserializeUser(async (id, done) => {
    return done(null, await getUserByID(id))
  })
}

module.exports = initPassport