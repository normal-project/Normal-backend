// Libs
import { server } from '../../db/models/server';
import { Router, Request, Response } from 'express';

// Router
const router = Router();

router.get('/', (req: Request, res: Response) => {
	res.status(418).send('¿Qué pretendes hacer?');
});


/**************************************/


// Retornar valores de suggest
// RECIBO: ID (URL)
router.get('/:serverId', async (req: Request, res: Response) => {
	const data: any = await server.findOne({ serverId: req.params.serverId });

	if (data) {
		res.json({
			suggest: data.suggest
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
// RECIBO: ID (URL) y nuevo canal (body)
router.post('/:serverId', async (req: Request, res: Response) => {
	const data: any = await server.findOneAndUpdate(
		{ serverId: req.params.serverId },
		{
			suggest: {
				enabled: true,
				channelId: req.body.channelId
			}
		}
	);

	if (data) {
		res.json({
			enabled: true,
			channelId: req.body.channelId
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
			suggest: {
				enabled: false,
				channelId: 'null'
			}
		},
		{ new: true }
	);

	if (data) {
		res.json({
			enabled: false,
			channelId: 'null'
		});
	} else {
		res.status(404).json({
			status: 'Not found',
			message: 'No se ha encontrado ese server'
		});
	}
});


/**************************************/


// Crear sugerencia
// RECIBO: ID (URL), Mensaje ID (URL), sugerencia (body)
router.post('/:serverId/:msgId/create', async (req: Request, res: Response) => {
	const data = await server.findOne({ serverId: req.params.serverId });

	if (data) {
		const newSuggestion = {
			msgId: req.params.msgId,
			suggest: req.body.suggest,
			status: 'emited',
			voters: {
				upvote: [],
				downvote: []
			}
		};

		data.suggest.suggestions.push(newSuggestion);
		await data.save();

		res.json({
			status: 'ok',
			message: 'Sugerencia emitida'
		})
	} else {
		res.status(404).json({
			status: 'Not found',
			message: 'No se ha encontrado ese server'
		});
	}
});


/**************************************/


// Eliminar sugerencia
// RECIBO: ID (URL), Mensaje ID (URL)
router.delete('/:serverId/:msgId', async (req: Request, res: Response) => {
	const data = await server.findOne({ serverId: req.params.serverId });

	if (data) {
		const sug = data.suggest.suggestions.find(
			(e) => e.msgId === req.params.msgId
		);

		const index = data.suggest.suggestions.indexOf(sug!);
		data.suggest.suggestions.splice(index, 1);

		await data.save();

		res.json({
			status: 'ok',
			message: 'Sugerencia eliminada'
		})
	} else {
		res.status(404).json({
			status: 'Not found',
			message: 'No se ha encontrado ese server'
		});
	}
});


/**************************************/


// Operaciones de votacion
const addUpvote = async (req: any) => {
	const data = await server.findOne({ serverId: req.params.serverId });

	if (data) {
		const sug = data.suggest.suggestions.find(
			(e) => e.msgId === req.params.msgId
		);

		const index = data.suggest.suggestions.indexOf(sug!);
		data.suggest.suggestions[index].voters.upvote.push(req.body.userId);
		await data.save();
	}
}

const addDownvote = async (req: any) => {
	const data = await server.findOne({ serverId: req.params.serverId });

	if (data) {
		const sug = data.suggest.suggestions.find(
			(e) => e.msgId === req.params.msgId
		);

		const index = data.suggest.suggestions.indexOf(sug!);
		data.suggest.suggestions[index].voters.downvote.push(req.body.userId);
		await data.save();
	}
};

const deleteUpvote = async (req: any) => {
	const data = await server.findOne({ serverId: req.params.serverId });

	if (data) {
		const sug = data.suggest.suggestions.find(
			(e) => e.msgId === req.params.msgId
		);

		const index = data.suggest.suggestions.indexOf(sug!);
		const index2 = data.suggest.suggestions[index].voters.upvote.indexOf(req.body.userId);
		data.suggest.suggestions[index].voters.upvote.splice(index2, 1);
		await data.save();
	}
};

const deleteDownvote = async (req: any) => {
	const data = await server.findOne({ serverId: req.params.serverId });

	if (data) {
		const sug = data.suggest.suggestions.find(
			(e) => e.msgId === req.params.msgId
		);

		const index = data.suggest.suggestions.indexOf(sug!);
		const index2 = data.suggest.suggestions[index].voters.downvote.indexOf(req.body.userId);
		data.suggest.suggestions[index].voters.downvote.splice(index2, 1);
		await data.save();
	}
};


/**************************************/


// Votar sugerencia
// RECIBO: ID (URL), Mensaje ID (URL), voto (body)
router.post('/:serverId/:msgId/vote', async (req: Request, res: Response) => {
	// obtener server
	const getData = await server.findOne({ serverId: req.params.serverId });

	if (getData) {
		// comprobar sugerencia
		const getSug = getData.suggest.suggestions.find(
			(sug) => sug.msgId === req.params.msgId
		);

		if (getSug) {
			// comprobar si ya ha votado
			const hasVotedUpvote = getSug.voters.upvote.find(
				(voter: any) => voter == req.body.userId
			);
			const hasVotedDownvote = getSug.voters.downvote.find(
				(voter: any) => voter == req.body.userId
			);

			if (
				(hasVotedUpvote && req.body.vote === 'upvote') ||
				(hasVotedDownvote && req.body.vote === 'downvote')
			) {
				// ya ha votado
				res.status(400).json({
					status: 'Bad request',
					message: 'Ya ha votado'
				})
			} else if (
				hasVotedUpvote &&
				!hasVotedDownvote &&
				req.body.vote === 'downvote'
			) {
				// ha votado upvote y quiere votar downvote
				await deleteUpvote(req);
				await addDownvote(req);
				res.json({
					status: 'ok',
					message: 'Voto actualizado'
				})
			} else if (
				!hasVotedUpvote &&
				hasVotedDownvote &&
				req.body.vote === 'upvote'
			) {
				// ha votado downvote y quiere votar upvote
				await deleteDownvote(req);
				await addUpvote(req);
				res.json({
					status: 'ok',
					message: 'Voto actualizado'
				})
			} else {
				if (req.body.vote === 'upvote') {
					await addUpvote(req);
					res.json({
						status: 'ok',
						message: 'Voto añadido'
					})
				} else if (req.body.vote === 'downvote') {
					await addDownvote(req);
					res.json({
						status: 'ok',
						message: 'Voto añadido'
					})
				}
			}
		} else {
			res.status(404).json({
				status: 'Not found',
				message: 'No se ha encontrado la sugerencia'
			})
		}
	} else {
		res.status(404).json({
			status: 'Not found',
			message: 'No se ha encontrado ese server'
		});
	}
});


/**************************************/


// Eliminar voto
// RECIBO: ID (URL), Mensaje ID (URL), Usuario (body)
router.delete('/:serverId/:msgId/vote', async (req: Request, res: Response) => {
	const getData = await server.findOne({ serverId: req.params.serverId });

	if (getData) {
		const getSug = getData.suggest.suggestions.find(
			(sug) => sug.msgId === req.params.msgId
		);

		if (getSug) {
			const findUpvote = getSug.voters.upvote.find(
				(voter: any) => voter == req.body.userId
			);
			const findDownvote = getSug.voters.downvote.find(
				(voter: any) => voter == req.body.userId
			);

			if (!findUpvote && !findDownvote) {
				res.status(400).json({
					status: 'Bad request',
					message: 'No ha votado'
				});
			} else {
				if (findUpvote) {
					await deleteUpvote(req);
					res.json({
						status: 'ok',
						message: 'Voto eliminado'
					});
				} else if (findDownvote) {
					await deleteDownvote(req);
					res.json({
						status: 'ok',
						message: 'Voto eliminado'
					});
				}
			}
		} else {
			res.status(404).json({
				status: 'Not found',
				message: 'No se ha encontrado la sugerencia'
			})
		}
	} else {
		res.status(404).json({
			status: 'Not found',
			message: 'No se ha encontrado ese server'
		});
	}
});


/**************************************/


// aprobar/denegar sugerencia
// RECIBO: ID (URL), Mensaje ID (URL), aprobar/denegar (body)
router.post(
	'/:serverId/:msgId/approve',
	async (req: Request, res: Response) => {
		const data = await server.findOne({ serverId: req.params.serverId });

		if (data) {
			const sug = data.suggest.suggestions.find(
				(e) => e.msgId === req.params.msgId
			);
			const index = data.suggest.suggestions.indexOf(sug!);

			data.suggest.suggestions.splice(index, 1);

			if (req.body.status == 'approved') {
				res.json({
					status: 'approved',
					msg: 'Sugerencia aprobada',
				});
			} else if (req.body.status == 'denied') {
				res.json({
					status: 'denied',
					msg: 'Sugerencia denegada',
				});
			}
		}
	}
);

export default router;
