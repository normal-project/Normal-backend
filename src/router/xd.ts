// Libs
import { Router } from 'express';
import dotenv from 'dotenv';
import jwt from 'express-jwt';


// env
dotenv.config();
const key: string = process.env.SECRET!;
const usertoken: string = process.env.USERTOKEN!;


// Router
const router = Router();

router.get('/', jwt({ secret: key, algorithms: ['HS256'] }), (req: any, res: any) => {
    if(req.user.admin && req.user.user == usertoken){
        res.json({
            name: 'Autorizado pero en xd',
            title: 'hola :)'
        })
    } else {
        res.status(403).send('Forbidden :)');
    }
})

export default router;