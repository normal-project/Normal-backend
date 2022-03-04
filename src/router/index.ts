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

router.use(
	jwt({ secret: key, algorithms: ['HS256'] }),
	(req: any, res: any, next: any) => {
		if (!req.user.admin && req.user.user !== usertoken) {
			res.status(401).send('Unauthorized');
		}

		next();
	}
);


router.get('/', (req: any, res: any) => {
	res.send('hola, buscas algo?')
});


router.get('/test', (req: any, res: any) => {
    res.json({
        res: 'hola, que tal'
    });
});



// export
export default router;
