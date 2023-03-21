const router = require("express").Router();
const user = require("./user.router.js");
const orders = require("./order.router.js");
const items = require("./item.router.js");



router.use("/users", user);
router.use("/orders", orders);
router.use("/items", items);



module.exports = router;