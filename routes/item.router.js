const router = require("express").Router();
const auth = require("../middlewares/auth.js")
const { body , validationResult, check  } = require('express-validator');
const {uploadImage} = require("../middlewares/upload.js")
const {validator} = require("../middlewares/uploadvalidate.js")
const Items = require("../controllers/items");
const item = new Items();
require('dotenv').config()

router.get('/item', (req,res) => {
    item.listItem(req,res)
} )

router.post('/add-item',
    check('item_name').notEmpty().withMessage('Item name must be filled'),
    check('stock').notEmpty().withMessage('Stock must be filled').isInt().withMessage('Number only'),
    check('price').notEmpty().withMessage('Price must be filled').isInt().withMessage('Number only')
    ,auth, (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    item.addItem(req,res)
} )

router.put('/update-item',
    check('item_id').notEmpty().withMessage('Item ID must be filled'),
    check('item_name').notEmpty().withMessage('Item name must be filled'),
    check('stock').notEmpty().withMessage('Stock must be filled').isInt().withMessage('Number only'),
    check('price').notEmpty().withMessage('Price must be filled').isInt().withMessage('Number only')
    ,auth, (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    item.updateItem(req,res)
} )

router.get('/detail-item',
    check('item_id').notEmpty().withMessage('Item ID must be filled')
    , (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    item.detailItem(req,res)
} )

router.post('/add-image-product',
    uploadImage.single('file'),
    //validator,
    auth, (req,res) => {
      
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
      }

      item.uploadPhotoProduct(req,res)
    }
 )

 router.post('/add-photo-product',
  uploadImage.single('file'),
  (req , res ) => {
    
    item.uploadPhotoSync(req,res)
  }
 )

module.exports = router