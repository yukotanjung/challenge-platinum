const express = require('express')
const app = express()
const port = 3000
const router = require("./routes/router.js");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", router);


const server = app.listen(port,() =>{
    console.log('running server with port ' + port);
})

module.exports = server