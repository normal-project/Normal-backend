// libs
import express from 'express';
import dotenv from 'dotenv';

import index from './router/index';
import xd from './router/xd';


// server
const app = express();


// settings
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2)


// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// routes
app.use('/', index);
app.use('/xd', xd);


// init
app.listen(app.get('port'), () => {
    console.log(`\nServer en el puerto ${app.get('port')}\n--------------------------`)
})