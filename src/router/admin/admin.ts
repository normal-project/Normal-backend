// Libs
import { Router } from 'express';
import dotenv from 'dotenv';


// env
dotenv.config();


// Router
const router = Router();

// prevenir usuarios ajenos
router.use((req: any, res: any, next: any) => {
    if(req.body.authorId !== process.env.ADMIN){
        res.status(401).send('Unauthorized');
    } else {
        next();
    }
})

router.get('/', (req: any, res: any) => {
		res.status(418).send('¿Qué pretendes hacer?')
});


// pretendo usar esta ruta para cosas administrativas

export default router;