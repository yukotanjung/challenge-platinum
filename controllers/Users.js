const model = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class Users{

  async loginUser(req,res){
    const {username,password} = req.body

    await model.Users.findOne({
      where : {
        username : username,
        status : 1,
      }
    })
    .then(function(result){
      let passwordHash = result.password;
      let checkPassword = bcrypt.compareSync(password, passwordHash);
      if(checkPassword){
        res.status(200).json({
          status : 200,
          message : "login success",
          token : jwt.sign({userid : result.userid},'yuko-binar')
        })
      }else{
        res.status(400).json({
          status : 400,
          message : 'Incorect Password'
        })
      }
    })
    .catch(function(error){
      res.status(500).json(error)
    })

  }
    
   async listuser(req,res){
      await model.Users.findAll({
        attributes: ['username', 'fullname', 'email', 'status', 'input_date']
        })
        .then(function (result) {
            res.status(200).json({
                status : 200,
                "data" : result
            });
        })
        .catch(function (error) {
        res.json({ error: error });
        });
    }

    async addUser(req,res){
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(req.body.password, salt);
      await model.Users.create({
            username: req.body.username,
            password: hash,
            fullname: req.body.fullname,
            email: req.body.email,
            status: 1,
          })
            .then(function (result) {
                res.status(200).json({
                    status : 200,
                    "data" : result
                });
            })
            .catch(function (error) {
              res.json({ error: error });
            });
    }

    async inactiveUser(req,res){
      let decodedId = req.decoded.userid;
    
      if (Number(decodedId) != Number(req.body.userid)) {
        return res.status(401).json({
          status : 401,
          message : "Forbidden Access"
        })
      }
      await model.Users.update({
        status : 0,
      },
      {
        where: {
          userid: req.body.userid,
        },
      }
      )
      .then(function (result){
          res.status(200).json({
            status : 200,
            "message" : "success inactive"
        })
      })
      .catch(function(error){
        res.status(500).json({ error: error });
      })
    }

    async activedUser(req,res){
      
      let decodedId = req.decoded.userid;
    
      if (Number(decodedId) != Number(req.body.userid)) {
        return res.status(401).json({
          status : 401,
          message : "Forbidden Access"
        })
      }

      await model.Users.update({
        status : 1,
      },
      {
        where: {
          userid: req.body.userid,
        },
      }
      )
      .then(function (result){
          res.status(200).json({
            status : 200,
            "message" : "success inactive"
        })
      })
      .catch(function(error){
        res.status(500).json({ error: error });
      })
    }

    logOutUser(req,res){
      const authHeader = req.headers["token"];
      jwt.sign(authHeader, "yuko-binar", { expiresIn: 1 } , (logout, err) => {
        if (logout) {
          res.status(200).json({msg : 'You have been Logged Out' })
        } else {
          res.status(200).json({
            error : err
          })
        }
        
        })
    }
}

module.exports = Users