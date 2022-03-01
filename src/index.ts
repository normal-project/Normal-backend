// libs
import express from 'express';
import dotenv from 'dotenv';

// routes
import index from './router/index';
import xd from './router/xd';
import moderation from './router/moderation/moderation';


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
app.use('/moderation', moderation);
app.use('/moderation/<', moderation);


// init
app.listen(app.get('port'), () => {
    console.log(`\nServer en el puerto ${app.get('port')}\n--------------------------`)
})