// init db
import init from './db/init';
init();

// libs
import express from 'express';
import bodyParser from 'body-parser';

// routes
import index from './router/index';
import xd from './router/test'; // test
import server from './router/server/server';
import admin from './router/admin/admin';


// server
const app = express();

// settings
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2)

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// routes
app.use('/', index);
app.use('/xd', xd); // test
app.use('/server', server)
app.use('/admin', admin)



// server
app.listen(app.get('port'), () => {
    console.log(`\nServer en el puerto ${app.get('port')}\n--------------------------`)
})