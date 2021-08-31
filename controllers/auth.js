const User = require('../models/user')
const Order = require('../models/order')

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((e, user) => {
    if (e || !user) {
      return res.status(400).json({
        error: 'No user was found in DB',
      })
    }
    req.profile = user
    next()
  })
}

exports.getUser = (req, res) => {
  //TODO: get back hear for password
  req.profile.salt = undefined
  req.profile.createdAt = undefined
  req.profile.updatedAt = undefined
  req.profile.encry_password = undefined
  return res.json(req.profile)
}

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    {
      _id: req.profile._id,
    },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (e, user) => {
      if (e) {
        return res.status(400).json({
          error: 'you are not authorised to update this user',
        })
      }

      user.salt = undefined
      user.createdAt = undefined
      user.updatedAt = undefined
      user.encry_password = undefined

      return res.json(user)
    }
  )
}

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate('user', '_id name')
    .exec((e, order) => {
      if (e) {
        return res.status(400).json({
          error: 'No order in this account',
        })
      }
      return res.json(order)
    })
}

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = []
  req.body.order.products.forEach((item) => {
    purchases.push({
      _id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    })
  })

  //store in DB
  User.findOneAndUpdate(
    {_id: req.profile._id},
    {$push:{purchases:purchases}},
    {new: true},
    (e,purchases)=>{
      if(e){
        return res.status(400).json({
          error: 'unable to save purchase list',
        })
      }
      next()
    }
  )
  
}
