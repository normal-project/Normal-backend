// Libs
import { Router } from 'express';
import { server } from '../../db/models/server';

// routes
import suggest from './suggest';


// Router
const router = Router(); // { mergeParams: true } sirve para fusionar los datos de la ruta padre y la ruta hijo

router.get('/', (req: any, res: any) => {
	res.status(300).send(`Tienes muchas rutas disponibles`)
});


// obtener datos de server
router.get('/:serverId', async (req: any, res: any) => {
	const data: any = await server.findOne({ id: req.params.serverId });

	if(data){
		res.json(data);
	} else {
		res.status(404).send('No se ha encontrado ese server')
	}
});

// Crear datos de un server
router.post('/create', (req: any, res: any) => {
	const newServer = new server({
		id: req.body.serverId
	});

	newServer.save();
	res.send('Server nuevo registrado');
});


router.use('/suggest', suggest)

export default router;