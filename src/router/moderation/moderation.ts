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
        res.status(200).send('Rutas disponibles:\n>/moderation/warn')
})


export default router;