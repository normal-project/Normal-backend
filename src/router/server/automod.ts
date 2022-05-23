// Libs
import { server } from '../../db/models/server';
import { Router, Request, Response } from 'express';

// Router
const router = Router();

router.get('/', (req: Request, res: Response) => {
	res.status(418).send('¿Qué pretendes hacer?');
});


/**************************************/


// Retornar valores de automod
// RECIBO: ID (URL)
router.get('/:serverId', async (req: Request, res: Response) => {
	const data: any = await server.findOne({ serverId: req.params.serverId });

	if (data) {
		res.json({
			automod: data.moderation.automod
		});
	} else {
		res.status(404).json({
			status: 'Not found',
			message: 'No se ha encontrado ese server'
		});
	}
});


/**************************************/


// activar canal
// RECIBO: ID (URL)
router.post('/:serverId', async (req: Request, res: Response) => {
	const data: any = await server.findOneAndUpdate(
		{ serverId: req.params.serverId },
		{
			moderation: {
				automod: true
			}
		},
		{ new: true }
	);

	if (data) {
		res.json({
			enabled: true
		});
	} else {
		res.status(404).json({
			status: 'Not found',
			message: 'No se ha encontrado ese server'
		});
	}
});


/**************************************/


// desactivar canal
// RECIBO: ID (URL)
router.delete('/:serverId', async (req: Request, res: Response) => {
	const data: any = await server.findOneAndUpdate(
		{ serverId: req.params.serverId },
		{
			moderation: {
				automod: false
			}
		}
	);

	if (data) {
		res.json({
			status: 'ok',
			message: 'automod desactivado'
		})
	} else {
		res.status(404).json({
			status: 'Not found',
			message: 'No se ha encontrado ese server'
		});
	}
});

export default router;