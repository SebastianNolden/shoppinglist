const mongoose = require('mongoose')

const einkaufslisteSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  shoppinglist: {
    type: Array,
    defualt: [],
    required: true
  }
})

// first string in model will be changed from User = users. Lower Case + s added...
module.exports = mongoose.model('Shoppinglist', einkaufslisteSchema)