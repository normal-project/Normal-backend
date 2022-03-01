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
            user: 'Autorizado pero en xd',
            reason: 'hola :)'
        })
})

router.post('/', (req: any, res: any) => {
    res.json({
        user: 'Me has devuelto ' + req.body.user,
        reason: 'El título es ' + req.body.reason
    })
})

export default router;