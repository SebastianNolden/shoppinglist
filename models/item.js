const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({ 
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    default: 1
  },
  used: {
    type: Number,
    default: 1
  }
})

module.exports = mongoose.model('Item', itemSchema)