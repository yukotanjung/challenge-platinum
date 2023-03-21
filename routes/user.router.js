const router = require("express").Router();
const auth = require("../middlewares/auth.js");
const { body , validationResult, check  } = require('express-validator');
const Users = require("../controllers/users");
const user = new Users();


router.post('/add-user',
check('username').notEmpty().withMessage('Username must be filled'),
check('password').notEmpty().withMessage('Password must be filled')
.isLength({ min: 5 }).withMessage('Password must be at least 5 chars long'),
check('fullname').notEmpty().withMessage('Fullname must be filled'),
check('email').notEmpty().withMessage('Email must be filled')
.isEmail().withMessage('Email is not valid')
,(req,res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    user.addUser(req,res)
} )

router.get('/user',auth, (req,res) => {
    user.listuser(req,res)
} )

router.put('/inactive-user',auth, (req,res) => {
    user.inactiveUser(req,res)
  } )
  
  router.put('/activated-user',auth, (req,res) => {
    user.activedUser(req,res)
  } )
  
  router.post('/user-login',
  check('username').notEmpty().withMessage('Username must be filled'),
  check('password').notEmpty().withMessage('Password must be filled')
  .isLength({ min: 5 }).withMessage('Password must be at least 5 chars long'),
  (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    user.loginUser(req,res)
  } )

  router.put('/logout',auth, (req,res) => {
    user.logOutUser(req,res)
  } )

module.exports = router;