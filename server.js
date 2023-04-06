const express = require('express')
const app = express()
const port = 3000
const router = require("./routes/router.js");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const path = require('path')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const model = require("./models");

const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'marketplace',
  password: '12345',
  port: 5432,
  queueLimit : 0, // unlimited queueing
  connectionLimit : 0
});

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", router);

app.get('/chating', (req, res, next)=>{
   const custid = req.query.cid
   const userid = req.query.uid
   const type = req.query.type
    res.render('chat',{custid ,userid,type})
})

nicknames = [];
io.on('connection', function (socket) {
   socket.on('new user', function (data, callback) {
     if (nicknames.indexOf(data) != -1) {
       console.log('hata');
       callback(false);
     }
     else {
       callback(true);
       socket.nickname = data;
       console.log(socket.nickname);
       nicknames.push(socket.nickname);
       io.sockets.emit('usernames', nicknames);
       updateNicknames();
     }
   });
 
   function updateNicknames() {
     io.sockets.emit('usernames', nicknames);
   }
   socket.on('disconnect', function (data) {
     if (!socket.nickname) return;
     nicknames.splice(nicknames.indexOf(socket.nicknames), 1);
     updateNicknames();
   });

   socket.on('chatroom', function (msg) {
      console.log('message: ' + msg);
      io.emit('chatroom', { msg: msg, nick: socket.nickname });
    });

   socket.on('privateMessage', async function (data) {
     console.log(`${socket.nickname} in ${data.room} say "${data.msg}"`);
     
    await model.Chat.create({
      room: data.room,
      user_id: data.userid,
      customer_id: data.custid,
      message: data.msg,
      type : data.type
    })
      .then(function (result) {
          console.log('message sent')
      })
      .catch(function (error) {
         console.log("error : " + error)
      });
     io.emit(data.room, { msg: data.msg, nick: socket.nickname });
   });
 
   socket.on('typing', function (data) {
     socket.broadcast.emit('typing', socket.nickname);
   });
 
 });

server.listen(port,() =>{
    console.log('running server with port ' + port);
})

module.exports = server