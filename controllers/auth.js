const User = require('../models/user')
const { check, validationResult } = require('express-validator')
var jwt = require('jsonwebtoken')
var expressJwt = require('express-jwt')

exports.signup = (req, res) => {
  // console.log("REQ BODY", req.body)
  // res.json({
  //     message:'signup'
  // })

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    })
  }

  const user = new User(req.body)
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: 'NOT able to save user in DB',
      })
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    })
  })
}

exports.signin = (req, res) => {
  const { email, password } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    })
  }

  User.findOne({ email }, (e, user) => {
    if (e || !user) {
      return res.status(400).json({
        error: 'User email doesnt exist in database',
      })
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Email and password do not match',
      })
    }

    //create token

    const token = jwt.sign({ _id: user._id }, process.env.SECRET)
    //put token in cookie

    res.cookie('token', token, { expire: new Date() + 9999 })

    //send response to front end
    const { _id, name, email, role } = user
    return res.json({ token, user: { _id, name, email, role } })
  })
}

exports.signout = (req, res) => {
    res.clearCookie("token");
  res.json({
    message: 'signout success',
  })
}

//protected routes


exports.isSignedin=expressJwt({
    secret:process.env.SECRET,
    userProperty:"auth",
    algorithms: ['HS256']
})

//custom middile wares

exports.isAuthenticated=(req,res,next)=>{
  let checker=req.profile && req.auth && req.profile.__id ===req.auth.__id
  if(!checker){
    return res.status(403).json({
      error:"ACCESS DENIED"
    })
  }
  next()
}

exports.isAdmin=(req,res,next)=>{
  if(req.profile.role===0){
    return res.status(403).json({error:"YOU ARE NOT ADMIN"})
  }
  next()
}