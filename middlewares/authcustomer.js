const jwt = require("jsonwebtoken");
const model = require("../models");

module.exports = async (req, res, next) => {
  if (req.headers.token) {
    let token = req.headers.token;

    /* 
    proses cek token apakah token yang dikirim itu masuk daftar
    blacklist ?
    */
    const checkBlackList = await model.BlacklistToken.findOne({ 
      where: { token: token } });
      
    if (checkBlackList) {
      return res.status(401).send({
        auth: false,
        message: 'Your token is blacklist, please login again'
      })
    }

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
