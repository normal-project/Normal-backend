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

router.get('/', (req: any, res: any) => {
        res.json({
            name: 'Autorizado pero en xd',
            title: 'hola :)'
        })

})

export default router;