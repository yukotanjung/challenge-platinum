const model = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Sequelize = require('sequelize');
const op = Sequelize.Op;

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
          token : jwt.sign({userid : result.userid,type:'admin'}, process.env.JWT_SECRET , { expiresIn: '1h' })
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
      const page = req.query.page
      const limit = req.query.limit
      await model.Users.findAll({
        offset:((page-1)*limit),
        limit : limit,
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
      const alreadyExist = await model.Users.findOne({ 
        where: {
          [op.or]: [
            {username: req.body.username},
            {email: req.body.email}
          ]
        }
       });
      if(alreadyExist) return res.status(400).json({
        status: 400,
        message: "Username or Email already in use"
      });
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
                    "message" : "Register Success"
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
            "message" : "success Activated"
        })
      })
      .catch(function(error){
        res.status(500).json({ error: error });
      })
    }

    async logOutUser(req,res){
        try {
          if (req.headers.token) {
              const token = req.headers["token"];
              await model.BlacklistToken.create({ token: token })
              res.json({ 
                status: 200,
                message: 'Logout sucessfully' 
              }).status(200);
          } else {
              res.json({ 
                status: 200,
                message: 'Token required' 
              }).status(422);
          }
      } catch (error) {
          console.log(error);
          res.json({ msg: error }).status(400);
      }
    }
}

module.exports = Users