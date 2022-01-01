// Libs
import { Router } from 'express';
import dotenv from 'dotenv';
import jwt from 'express-jwt';


// env
dotenv.config();
const key: string = process.env.SECRET! + new Date().getUTCHours().toString();
const usertoken: string = process.env.USERTOKEN!;
const cryptoKey: string = process.env.CRYPTOKEY!;


// Decrypt
console.log(key);
// Router
const router = Router();

router.use(
    jwt({ secret: key, algorithms: ['HS256'] }),
	(req: any, res: any, next: any) => {

        console.log(req.headers)
        console.log(req.user)

		// if (!req.user.admin && req.user.user !== usertoken) {
		if (!req.user.admin && req.user.user !== usertoken) {
			res.status(403).send('Forbidden :)');
		}

		next();
	}
);


router.get('/', (req: any, res: any) => {
	res.json({
		name: 'Hola',
		title: 'Buscas algo?'
	});
});


router.get('/que', (req: any, res: any) => {
	res.json({
		name: 'Autorizado pero en que',
		title: 'so'
	});
});


router.get('/test', (req: any, res: any) => {


    res.json({
        res: 'hola, que tal'
    });
});



// export
export default router;
