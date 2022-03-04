// Libs
import { Router } from 'express';


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