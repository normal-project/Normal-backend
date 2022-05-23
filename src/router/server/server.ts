// Libs
import { server } from '../../db/models/server';
import { Router, Request, Response } from 'express';

// routes
import suggest from './suggest';
import automod from './automod';


// Router
const router = Router(); // { mergeParams: true } sirve para fusionar los datos de la ruta padre y la ruta hijo

router.get('/', (req: Request, res: Response) => {
	res.status(300).send(`Tienes muchas rutas disponibles`)
});


// obtener datos de server
router.get('/:serverId', async (req: Request, res: Response) => {
	const data: any = await server.findOne({ serverId: req.params.serverId });

	if(data){
		res.json(data);
	} else {
		res.status(404).json(
			{
				status: 'error',
				message: 'server no encontrado'
			}
		)
	}
});

// Crear datos de un server
router.post('/create', async (req: Request, res: Response) => {
	console.log(req.body);
	const newServer = new server({
		serverId: req.body.serverId
	});

	await newServer.save();

	res.send('Server nuevo registrado');
});


router.use('/suggest', suggest);
router.use('/automod', automod);

export default router;