const model = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const url = require('url')
const { sendEmail , templateEmail } = require("../middlewares/mailer");
require('dotenv').config()
const Sequelize = require('sequelize');
const op = Sequelize.Op;

class Customers {

    async list(req,res){
        await model.Customers.findAll({
            attributes: ['fullname','username', 'email', 'dob', 'gender', 'status', 'createdAt',]
            })
        .then(function (result) {
            console.log(result)
            res.status(200).json({
                status : 200,
                "data" : result
            });
        })
        .catch(function (err){
            res.status(500).json({
                status : 500,
                "data" : err,
            })
        })
    }

    async register(req,res){
        const alreadyExist = await model.Customers.findOne({ 
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
        let salt = bcrypt.genSaltSync(parseInt(process.env.SALT))
        let hash = bcrypt.hashSync(req.body.password, salt)
        await model.Customers.create({
            fullname : req.body.fullname,
            username: req.body.username,
            password: hash,
            email: req.body.email,
            phone : req.body.phone,
            gender : req.body.gender,
            dob : req.body.dob,
            status: 0
          })
            .then(async function (result) {
                req.body.customer_id = result.customer_id
                const email = templateEmail(req.body)
                
                sendEmail(req.body,email)
                
                res.status(200).json({
                    status : 200,
                    "data" : result,
                    "message" : "Register Success"
                });
            })
            .catch(function (error) {
                res.status(500).json({ 
                   status : 500,
                    error: error 
                });
            });
    }

    async login(req,res){
        const {username,password} = req.body

        await model.Customers.findOne({
        where : {
            username : username,
            status : 1,
        }
        })
        .then(function(result){
           
        
        if(result == null){
            res.status(400).json({
                status : 400,
                message : 'Username not found'
                })
        }else{
            let passwordHash = result.password;
            let checkPassword = bcrypt.compareSync(password, passwordHash);
            if(checkPassword){
                res.status(200).json({
                status : 200,
                message : "login success",
                token : jwt.sign({customer_id : result.customer_id,type:'customer'}, process.env.JWT_SECRET , { expiresIn: '1h' })
                })
            }else{
                res.status(400).json({
                status : 400,
                message : 'Incorect Password'
                })
            }
        }
        
        })
        .catch(function(error){
            res.status(500).json(error)
        })
    }

    async profile(req,res){
        let token = req.headers.token;
        let verify = jwt.verify(token, process.env.JWT_SECRET);
        await model.Customers.findOne({
            where : {
                customer_id :  verify.customer_id,
                status : 1,
            }
        })
        .then(function(result){
            if(result == null){
                res.status(400).json({
                    status : 400,
                    message : 'Profile not found'
                    })
            }else{
                res.status(200).json({
                    status : 200,
                    data : result
                    })
            }
        } )
        .catch(function(err){
            res.status(500).json(error)
        })
    }

    async sendingEmail(req,res){

        let email = templateEmail(req.body)

        const sending = await sendEmail(req.body,email)
        res.status(200).json({status : 200, message : 'Email ' + sending})
    }

    async verify(req,res){
        await model.Customers.update({
            status: 1
          },
          {
              where : {
                  customer_id : req.query.cid
              }
          }
          )
            .then(function (result) {
                res.status(200).json({
                    status : 200,
                    message : "Email verified"
                });
            })
            .catch(function (error) {
                res.status(500).json({ error: error });
            }); 
    }

    async logOutCustomer(req,res){
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
          res.json({ message: error }).status(400);
      }
    }
}

module.exports = Customers