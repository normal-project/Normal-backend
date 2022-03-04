import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export default function init() {

    const uri = process.env.MONGO_URI;
    const db = mongoose.connection;

    mongoose.connect( uri! , () => {
        return {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    });


    // eventos
    db.once('open', _ => {
        console.log(`Conectado a la base de datos`)
    });

    db.on('error', err => {
        console.log(`Error en la base de datos\n${err}`)
    });
}