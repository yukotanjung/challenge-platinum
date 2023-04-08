const model = require("../models");
const multer = require('multer');
const { uploadCloudinary } = require("../middlewares/upload");
const { json } = require("sequelize");

class Items{
    
   async listItem(req,res){
    const page = req.query.page
    const limit = req.query.limit
      await model.Items.findAll({
        include: model.Gallery,
        offset:((page-1)*limit),
        limit : limit,
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

    async addItem(req,res){
      await model.Items.create({
            item_name: req.body.item_name,
            stock: req.body.stock,
            price: req.body.price,
            status: 1,
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

    async updateItem(req,res){
        await model.Items.update({
              item_name: req.body.item_name,
              stock: req.body.stock,
              price: req.body.price,
              status: req.body.status
            },
            {
                where : {
                    item_id : req.body.item_id
                }
            }
            )
              .then(function (result) {
                  res.status(200).json({
                      status : 200,
                      message : "success update data"
                  });
              })
              .catch(function (error) {
                  res.status(500).json({ error: error });
              });
      }

    async detailItem(req,res){
        await model.Items.findOne({
            where : {
                item_id : req.body.item_id
            },
            include: model.Gallery
          }
          )
            .then(function (result) {
               
                res.status(200).json({
                    status : 200,
                    data : result
                });
            })
            .catch(function (error) {
                res.status(500).json({ error: error });
            });
    }

     uploadPhotoProduct(req,res){
       try {
        res.status(200).json({
            status : 200,
            data : 'Uploaded'
        });
       } catch (error) {
        res.status(500).json({ error: error });
       }
    }

    async uploadPhotoSync(req,res){

        try {
            const imageUrl = await uploadCloudinary(req.file.path)
            await model.Gallery.create({
                item_id: req.body.item_id,
                filepath : imageUrl,
              })
              .then(function (result) {
                res.status(200).json({
                    data : result
                });
             })
            
        } catch (error) {
            res.status(500).json({
                data : error
            })
        }
        //let filepath = req.file.path
        
    }
}

module.exports = Items