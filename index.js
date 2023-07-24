const express = require('express');
const PORT = 8000;
const server = express();
const db = require('./models');
require('dotenv').config()


server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).send('This is my API for minpro')
})

const { userRouters, authRouters, blogRouters } = require('./routers');
server.use(authRouters)
server.use(userRouters)
server.use(blogRouters)

server.listen(PORT, () => {
    console.log(`Server running at Port ${PORT}`);
    // db.sequelize.sync( {alter:true} ) //------------------- Synchronize
})