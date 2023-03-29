const jwt = require("jsonwebtoken");
const model = require("../models");

module.exports = (req, res, next) => {
  let token = req.headers.token;
  if (token) {
    let verify = jwt.verify(token, "yuko-binar");

    if(verify.type != 'customer'){
      res.status(401).json({
        message: "Kamu tidak memiliki akses",
      });
    }

    model.Customers.findOne({
      where: {
        customer_id: verify.customer_id,
      },
    })
      .then(function (result) {
        if (result) {
          req.decoded = verify;
          next();
        } else {
          res.status(401).json({
            message: "Kamu tidak memiliki akses",
          });
        }
      })
      .catch(function (error) {
        res.json({ error: error });
      });
  } else {
    res.status(401).json({
      message: "Silahkan Login Dahulu",
    });
  }
};
