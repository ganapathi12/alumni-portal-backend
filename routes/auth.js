var express = require('express')
var router = express.Router()
const { signout, signup, signin, isSignedin } = require('../controllers/auth')
const { check } = require('express-validator')

router.post(
  '/signup',
  [
    check('name')
      .isLength({ min: 3 })
      .withMessage('Name must be at least 3 characters long'),
    check('email').isEmail().withMessage('Email must be valid'),
    check('password')
      .isLength({ min: 3 })
      .withMessage('Password must be at least 3 characters long'),
  ],
  signup
)

router.post(
  '/signin',
  [
    check('email').isEmail().withMessage('Email must be valid'),
    check('password')
      .isLength({ min: 3 })
      .withMessage('Password must be at least 3 characters long'),
  ],
  signin
)

router.get('/signout', signout)

router.get("/testroute",isSignedin, (req,res)=>{
  res.json(req.auth)
})

module.exports = router
