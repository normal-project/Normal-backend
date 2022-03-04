// libs
import express from 'express';
import init from './db/init';

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
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// routes
app.use('/', index);
app.use('/xd', xd); // test
app.use('/server', server)
app.use('/admin', admin)


// init db
init();

// server
app.listen(app.get('port'), () => {
    console.log(`\nServer en el puerto ${app.get('port')}\n--------------------------`)
})