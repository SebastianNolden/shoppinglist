const express = require('express')
const router = express.Router()
const path = require('path')
const Item = require('../models/item')
const Shoppinglist = require('../models/shoppinglist')
const auth = require('../module/passport-init')
const db = require('../module/mongoose-functions')
const { v4: uuidv4} = require('uuid')



// einkaufsliste homepage route
router.get('/', auth.checkAuthenticated, async (req, res) => {
  const allItems = await db.allItemsFromDB()
  const allItemsNames = []
  allItems.forEach(i => allItemsNames.push(i.name))
  const shoppinglistDB = await db.allItemsinShoppinglist(req.cookies.user_id)
  let shoppinglistItems = ""

  if(shoppinglistDB) {
    const shoppinglistItemsOBJ = shoppinglistDB.shoppinglist
    shoppinglistItemsOBJ.forEach(i => shoppinglistItems += `${JSON.stringify(i)}.`)
    shoppinglistItems = shoppinglistItems.slice(0, -1)
  }

  res.render('shoppinglist.ejs', {itemNames: allItemsNames, shoppinglistItems: shoppinglistItems})
})

router.post('/addItem', auth.checkAuthenticated, async (req, res) => {
  // is working
  const itemValue = req.body.value
  const user_id = req.cookies.user_id
  const createNewItem = !(await db.itemInDB(itemValue))
  let item_id

  try {
    item_id = uuidv4()
  } catch (error) {
    console.log(error)
  }

  const item = new Item({
    name: itemValue
  })

  // check if item is already in database, if not --> save it in items collection
  if(createNewItem) {
    // füge item zur items collection hinzu
    try {
      const newItem = await item.save()
    } catch (err) {
      // ToDo: cath error here
    }
  }

  // add item into the shopping list collection
  // first item? go and create such a list
  const userShoppinglistinDB = await db.userShoppinglistinDB(user_id)

  if(!userShoppinglistinDB){
    // create new list
    const list = new Shoppinglist({
      user_id: user_id,
    })

    try {
      const newList = await list.save()
    } catch (err) {
      // toDo: cath err here
    }
  }

  const num = 1
  const done = false
  // add new Item to the list
  const response = await db.addItemtoShoppinglist(user_id, itemValue, num, item_id, done)

  let shoppinglistItems = await getAllItemsfromListasString(req.cookies.user_id)
  res.send(shoppinglistItems)
})

router.post('/removeItem', auth.checkAuthenticated, async (req, res) => {
  await db.removeItemfromShoppinglist(req.cookies.user_id, req.body.itemid)

  let shoppinglistItems = await getAllItemsfromListasString(req.cookies.user_id)
  res.send(shoppinglistItems)
})

router.post('/increaseAmountofItem', auth.checkAuthenticated, async (req, res) => {
  const curAmountObj = await db.allItemsinShoppinglist(req.cookies.user_id)
  let curAmount = 0
  curAmountObj.shoppinglist.forEach( (item) => {
    if (item.item_id === req.body.itemid) curAmount = item.amount + 1
  })
  await db.updateAmountofItemonList(req.cookies.user_id, req.body.itemid, curAmount)

  let shoppinglistItems = await getAllItemsfromListasString(req.cookies.user_id)
  res.send(shoppinglistItems)
})

router.post('/decreaseAmountofItem', auth.checkAuthenticated, async (req, res) => {
  let curAmountObj = await db.allItemsinShoppinglist(req.cookies.user_id)
  let curAmount = 0
  curAmountObj.shoppinglist.forEach( (item) => {
    if (item.item_id === req.body.itemid) {
      if (item.amount <= 1) curAmount = 1
      else curAmount = item.amount - 1
    }
  })
  await db.updateAmountofItemonList(req.cookies.user_id, req.body.itemid, curAmount)

  let shoppinglistItems = await getAllItemsfromListasString(req.cookies.user_id)
  res.send(shoppinglistItems)
})

router.post('/updateDoneStatusofItem', auth.checkAuthenticated, async (req, res) => {
  await db.updateDoneStatusofItemonList(req.cookies.user_id, req.body.itemid, req.body.newStatus)

  let shoppinglistItems = await getAllItemsfromListasString(req.cookies.user_id)
  res.send(shoppinglistItems)
})

router.post('/deleteWholeList', auth.checkAuthenticated, (req, res) => {
  db.deleteWholeUserList(req.cookies.user_id)

  res.json({status: 'notDone'})
})

async function getAllItemsfromListasString(user_id){
  const shoppinglistDB = await db.allItemsinShoppinglist(user_id)
  let shoppinglistItems = ""

  if(shoppinglistDB) {
    const shoppinglistItemsOBJ = shoppinglistDB.shoppinglist
    shoppinglistItemsOBJ.forEach(i => shoppinglistItems += `${JSON.stringify(i)}.`)
    shoppinglistItems = shoppinglistItems.slice(0, -1)
  }

  return shoppinglistItems
}

module.exports = router