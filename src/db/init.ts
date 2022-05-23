import { connect, connection } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export default async function init() {

    const uri = process.env.MONGO_URI;
    const db = connection;

    connect( uri! , () => {
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
