const model = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const url = require('url')
const { sendEmail , templateEmail } = require("../middlewares/mailer");
require('dotenv').config()

class Customers {

    async list(req,res){
        await model.Customers.findAll({
            attributes: ['fullname','username', 'email', 'dob', 'gender', 'status', 'createdAt',]
            })
        .then(function (result) {

            res.status(200).json({
                status : 200,
                "data" : result
            });
        })
        .catch(function (err){
            res.status(500).json({
                status : 500,
                "data" : error,
            })
        })
    }

    async register(req,res){
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
                token : jwt.sign({customer_id : result.customer_id,type:'customer'},'yuko-binar')
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
        let verify = jwt.verify(token, "yuko-binar");
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
              res.json({ msg: 'Logout sucessfully' }).status(200);
          } else {
              res.json({ msg: 'Token required' }).status(422);
          }
      } catch (error) {
          console.log(error);
          res.json({ msg: error }).status(422);
      }
    }
}

module.exports = Customers