const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  }
})

// first string in model will be changed from User = users. Lower Case + s added...
module.exports = mongoose.model('User', userSchema)