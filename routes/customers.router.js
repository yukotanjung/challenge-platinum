const router = require("express").Router();
const authcustomer = require("../middlewares/authcustomer.js");
const { body , validationResult, check  } = require('express-validator');
const Customers = require("../controllers/customers");
const customer = new Customers();

router.get('/list-customer', (req,res) => {
    customer.list(req,res)
} )

router.post('/register-customer',
    check('fullname').notEmpty().withMessage('Fullname must be filled'),
    check('username').notEmpty().withMessage('Username must be filled'),
    check('password').notEmpty().withMessage('Password must be filled')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 chars long'),
    check('email').notEmpty().withMessage('Email must be filled')
    .isEmail().withMessage('Email is not valid'),
    check('phone').notEmpty().withMessage('Phone must be filled')
    .isMobilePhone().withMessage('Phone number is not valid')
    .isLength({ min: 8 }).withMessage('Phone number is not valid'),
    check('gender').notEmpty().withMessage('Gender must be filled'),
    check('dob').notEmpty().withMessage('Date of birth must be filled'),

    (req,res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        customer.register(req,res)
    }
)

router.post('/login-customer',
  check('username').notEmpty().withMessage('Username must be filled'),
  check('password').notEmpty().withMessage('Password must be filled')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 chars long'),
  (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    customer.login(req,res)
  } )

  router.get('/profile',
  authcustomer,
    (req,res) => {
      customer.profile(req,res)
    }
  )

module.exports = router