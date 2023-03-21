const model = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Sequelize = require('sequelize');

class Orders{
    
   async listOrder(req,res){
    let decodedId = req.decoded.userid
    let userid = Number(decodedId)
      await model.Orders.findAll({
        where : {
          userid : userid,
        }
      })
        .then(function (result) {
            res.status(200).json({
                status : 200,
                "data" : result
            });
        })
        .catch(function (error) {
            res.status(500).json({ error: error });
        });
    }

    async addOrder(req,res){
        let decodedId = req.decoded.userid
        let userid = Number(decodedId)
     await model.Items.findOne({
        where : {
            item_id : req.body.item_id,
          }
     }).then(function (result) {
            let price = result.price
            let subtotal = parseInt(req.body.qty) * parseInt(price)
            model.Orders.create({
                userid: userid,
                item_id: req.body.item_id,
                qty: req.body.qty,
                price: price,
                subtotal : subtotal,
                status: 1,
              })
                .then(function (results) {
                    let stock = result.stock - req.body.qty 
                    model.Items.update({
                        stock : stock
                    },
                    {
                        where : {
                            item_id : req.body.item_id
                        }
                    }
                    ).then(function(){
                        res.status(200).json({
                            status : 200,
                            message : 'success'
                        });
                    })
                    
                })
                .catch(function (error) {
                    res.status(500).json({ error: error });
                });
        })
        .catch(function (error) {
            res.status(500).json({ error: error });
        });
        
       
    }

     deleteOrder(req,res,id){
      model.Orders.destroy({
        where : {
          id : id
        }
      })
    }

     updateStock(req,res,item_id,qty){
      model.Items.update({
        stock: Sequelize.literal(`stock + ${qty} `)
      },
      {
          where : {
              item_id : item_id
          }
      }
      )
    }

    removeOrder(req,res){
      let decodedId = req.decoded.userid;
      if (Number(decodedId) != Number(req.body.userid)) {
        return res.status(401).json({
          status : 401,
          message : "Forbidden Access"
        })
      }
     model.Orders.findOne({
        where : {
          id : req.body.id
        }
      })
      .then(async function(result){
        const item_id = result.item_id
        const qty = result.qty
        const trans = new Orders();
        await trans.deleteOrder(req,res,req.body.id)
        await trans.updateStock(req,res,item_id,qty)

        res.status(200).json({
          status : 200,
          message : 'Item order has been deleted'
        })
      }).catch(function(err){
        res.status(500).json({
          error : err
        })
      })
       
    }

    async updateStatus(req,res){
        await model.Orders.update(
            {
              status: 2,
            },
            {
              where: {
                id: req.body.id,
              },
            }
          )
            .then(function (result) {
                res.status(200).json({
                    status : 200,
                    "message" : "success update"
                });
            })
            .catch(function (error) {
              res.json({ error: error });
            });
    }
}

module.exports = Orders