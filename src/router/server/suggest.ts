// Libs
import { Router } from 'express';
import { server } from '../../db/models/server';

// Router
const router = Router();

router.get('/', (req: any, res: any) => {
	res.status(418).send('¿Qué pretendes hacer?')
});

// Retornar valores de suggest
// RECIBO: ID (URL)
router.get('/:serverId', async (req: any, res: any) => {
	const data: any = await server.findOne({ id: req.params.serverId });

	if(data){
		res.json({
			enabled: data.suggest.enabled,
			channelId: data.suggest.channelId
		});
	} else {
		res.status(404).send('No se ha encontrado ese server')
	}
});

// activar canal
// RECIBO: ID (URL) y nuevo canal (body)
router.post('/:serverId', async (req: any, res: any) => {
	const data: any = await server.findOneAndUpdate(
		{ id: req.params.serverId },
		{
			suggest: {
				enabled: true,
				channelId: req.body.channelId
			}
		}
	);

	if(data){
		res.json({
			enabled: true,
			channelId: req.body.channelId
		});
	} else {
		res.status(404).send('No se ha encontrado ese server')
	}
});

// desactivar canal
// RECIBO: ID (URL)
router.delete('/:serverId', async (req: any, res: any) => {
	const data: any = await server.findOneAndUpdate(
		{ id: req.params.serverId },
		{
			suggest: {
				enabled: false,
				channelId: 'null'
			}
		}
	);

	if(data){
		res.json({
			enabled: false,
			channelId: 'null'
		});
	} else {
		res.status(404).send('No se ha encontrado ese server')
	}
})


export default router;