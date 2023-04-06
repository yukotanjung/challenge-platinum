const model = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Sequelize = require('sequelize');
const { sequelize } = require("../models");

class Chats {
    async getChat(req,res){
        await model.Chat.findAll({
            where : {
              user_id : req.body.user_id,
              customer_id : req.body.customer_id
            },
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

    async getChatName(req,res){
        const customer = await model.Customers.findOne({
            attributes: ['fullname',],
            where : {
                customer_id : req.body.customer_id
            }
            })
        
        const username = await model.Users.findOne({
            attributes: ['fullname',],
            where : {
                userid : req.body.user_id
            }
            })
        
        
        res.status(200).json({
                status : 200,
                "customername" : customer.fullname,
                "username" : username.fullname,
            });
    }

    async getChatList(req,res){
        const customer_id = req.body.customer_id
        const data = await sequelize.query(`
            SELECT
                user_id,
                fullname 
            FROM
                "Chats"
                LEFT JOIN "Users" ON "Chats"."user_id" = "Users"."userid" 
            WHERE
                "customer_id" = ${customer_id} GROUP BY "user_id","fullname"
        `, 
            { 
                type: sequelize.QueryTypes.SELECT 
            }
        )

        res.status(200).json({
            status : 200,
            "data" : data,
        });
    }

    async getChatListAdmin(req,res){
        const user_id = req.body.user_id
        const data = await sequelize.query(`
            SELECT
                "Chats"."customer_id",
                fullname 
            FROM
                "Chats"
                LEFT JOIN "Customers" ON "Chats"."customer_id" = "Customers"."customer_id" 
            WHERE
                "user_id" = ${user_id} GROUP BY "Chats"."customer_id","fullname"
        `, 
            { 
                type: sequelize.QueryTypes.SELECT 
            }
        )

        res.status(200).json({
            status : 200,
            "data" : data,
        });
    }
}

module.exports = Chats