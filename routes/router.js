const router = require("express").Router();
const user = require("./user.router.js");
const orders = require("./order.router.js");
const items = require("./item.router.js");
const customer = require('./customers.router.js')
const chat = require('./chat.router.js')



router.use("/users", user);
router.use("/orders", orders);
router.use("/items", items);
router.use("/customer",customer)
router.use("/chat",chat)



module.exports = router;