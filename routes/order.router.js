const router = require("express").Router()
const auth = require("../middlewares/authcustomer.js")
const authadmin = require("../middlewares/auth.js")
const { body , validationResult, check  } = require('express-validator')

const Orders = require("../controllers/orders")
const order = new Orders();

router.get('/order',auth, (req,res) => {
    order.listOrder(req,res)
} )

router.post('/add-order',auth,
check('qty').notEmpty().withMessage('Quantity must be filled').isInt().withMessage('Number only'),
check('item_id').notEmpty().withMessage('Item ID must be filled').isInt().withMessage('Number only'),
(req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    order.addOrder(req,res)
} )

router.delete('/del-item-order',auth,
check('id').notEmpty().withMessage('ID must be filled'),
(req,res) => {
    order.removeOrder(req,res)
} )

router.put('/update-status-order',authadmin, (req,res) => {
  order.updateStatus(req,res)
} )

module.exports = router