const Shoppinglist = require('../models/shoppinglist')
const Item = require('../models/item')
const User = require('../models/user')


async function itemInDB(v) {
  const item = await Item.findOne({'name': {$eq: v}})

  // if item == null --> item is not in the list
  if(item) return true 
  else return false 
}

async function allItemsFromDB(){
  return await Item.find()
}

const findUserByMail = async (email) => {
  return await User.findOne({'email': {$eq: email}})
}
const findUserById = async (id) => {
  return await User.findOne({'_id': {$eq: id}})
}

const userShoppinglistinDB = async (id) => {
  const list = await Shoppinglist.findOne({'user_id': {$eq: id}})
  if(list) return true
  else return false
}

const removeItemfromShoppinglist = async (user_id, item_id) => {
  const list = await Shoppinglist.updateOne(
    {'user_id': user_id},
    {$pull: {'shoppinglist': {'item_id': item_id}}}
  )
}

const addItemtoShoppinglist = async (user_id, itemValue, itemAmount, item_id, done) => {
  await Shoppinglist.updateOne(
    {'user_id': user_id}, 
    {$push: 
      {
        'shoppinglist': 
        {
          'name': itemValue,
          'amount': itemAmount,
          'done': done,
          'item_id': item_id,
        }
      }
    })
}

const allItemsinShoppinglist = async (user_id) => {
  const shoppinglistItems = await Shoppinglist.findOne({'user_id': {$eq: user_id}})
  return shoppinglistItems
}

const updateAmountofItemonList = async (user_id, item_id, amount) => {
  const list = await Shoppinglist.updateOne(
    {'user_id': user_id, 'shoppinglist.item_id': item_id},
    {$set:
      {
        'shoppinglist.$.amount': amount
      }
    }
  )
}

const updateDoneStatusofItemonList = async (user_id, item_id, status) => {
  const list = await Shoppinglist.updateOne(
    {'user_id': user_id, 'shoppinglist.item_id': item_id},
    {$set:
      {
        'shoppinglist.$.done': status
      }
    }
  )
}

const deleteWholeUserList = async (user_id) => {
  const test = await Shoppinglist.deleteOne({'user_id': user_id})
}



module.exports = { itemInDB, allItemsFromDB, userShoppinglistinDB, findUserById, 
                   findUserByMail, addItemtoShoppinglist, removeItemfromShoppinglist,
                   allItemsinShoppinglist, updateAmountofItemonList, updateDoneStatusofItemonList,
                   deleteWholeUserList }