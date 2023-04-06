const router = require("express").Router();
const authcustomer = require("../middlewares/authcustomer.js");
const { body , validationResult, check  } = require('express-validator');
const Chats = require("../controllers/Chats");
const chat = new Chats();

router.post('/get-chat', (req,res) => {
    chat.getChat(req,res)
} )

router.post('/get-chat-name', (req,res) => {
    chat.getChatName(req,res)
} )

router.post('/get-chat-list', (req,res) => {
    typechat = req.body.type
    if(typechat == 'c'){
        chat.getChatList(req,res)
    }else if(typechat == 'u'){
        chat.getChatListAdmin(req,res)
    }
    
} )

module.exports = router