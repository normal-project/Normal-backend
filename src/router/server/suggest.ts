// Libs
import { Router } from 'express';
import { server } from '../../db/models/server';

// Router
const router = Router();

router.get('/', (req: any, res: any) => {
	res.status(418).send('¿Qué pretendes hacer?')
});


/**************************************/


// Retornar valores de suggest
// RECIBO: ID (URL)
router.get('/:serverId', async (req: any, res: any) => {
	const data: any = await server.findOne({ id: req.params.serverId });

	if(data){
		res.json({
			suggest: data.suggest
		});
	} else {
		res.status(404).send('No se ha encontrado ese server')
	}
});


/**************************************/


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


/**************************************/


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
});


/**************************************/


// Crear sugerencia
// RECIBO: ID (URL), Mensaje ID (URL), sugerencia (body)
router.post('/:serverId/:msgId/create', async (req: any, res: any) => {
	const data: any = await server.findOneAndUpdate(
		{ id: req.params.serverId },
		{
			suggest: {
				suggestions: {
					$push: {
						msgId: req.params.msgId,
						suggest: req.body.suggest,
						date: new Date(),
						votes: 0,
						status: 'emited',
						voters: {
							upvote: [],
							downvote: []
						}
					}
				}
			}
		
		}
	);

	if(data){
		res.send('Sugerencia emitida');
	} else {
		res.status(404).send('No se ha encontrado ese server')
	}
});


/**************************************/


// Operaciones de votacion
const addUpvote = async (req: any) => {
	return await server.findOneAndUpdate(
		{ id: req.params.serverId },
		{
			suggest: {
				suggestions: {
					$find: {
						msgId: req.params.msgId
					},
					voters: {
						upvote: {
							$push: {
								id: req.body.userId
							}
						}
					}
				}
			}
		
		}
	);
}

const addDownvote = async (req: any) => {
	return await server.findOneAndUpdate(
		{ id: req.params.serverId },
		{
			suggest: {
				suggestions: {
					$find: {
						msgId: req.params.msgId
					},
					voters: {
						downvote: {
							$push: {
								id: req.body.userId
							}
						}
					}
				}
			}
		
		}
	);
}

const deleteUpvote = async (req: any) => {
	return await server.findOneAndUpdate(
		{ id: req.params.serverId },
		{
			suggest: {
				suggestions: {
					$find: {
						msgId: req.params.msgId
					},
					voters: {
						upvote: {
							$pull: {
								id: req.body.userId
							}
						}
					}
				}
			}
			
		}
	);
}

const deleteDownvote = async (req: any) => {
	return await server.findOneAndUpdate(
		{ id: req.params.serverId },
		{
			suggest: {
				suggestions: {
					$find: {
						msgId: req.params.msgId
					},
					voters: {
						upvote: {
							$pull: {
								id: req.body.userId
							}
						}
					}
				}
			}
			
		}
	);
}


/**************************************/


// Votar sugerencia
// RECIBO: ID (URL), Mensaje ID (URL), voto (body)
router.post('/:serverId/:msgId/vote', async (req: any, res: any) => {
	// obtener server
	const getData = await server.findOne({ id: req.params.serverId });

	if(getData){
		// comprobar sugerencia
		const getSug = getData.suggest.suggestions.find(sug => sug.msgId === req.params.msgId);

		if(getSug){
			// comprobar si ya ha votado
			const hasVotedUpvote = getSug.voters.upvote.find((voter: any) => voter.id == req.body.userId);
			const hasVotedDownvote = getSug.voters.downvote.find((voter: any) => voter.id == req.body.userId);
			
			if(hasVotedUpvote && hasVotedDownvote){
				// ya ha votado
				res.status(400).send('Ya ha votado');
			} else if(hasVotedUpvote && !hasVotedDownvote && req.body.vote === 'downvote'){
				// ha votado upvote y quiere votar downvote
				await deleteUpvote(req);
				await addDownvote(req);
				res.send('Voto actualizando');
			} else if (!hasVotedUpvote && hasVotedDownvote && req.body.vote === 'upvote'){
				// ha votado downvote y quiere votar upvote
				await deleteDownvote(req);
				await addUpvote(req);
				res.send('Voto eliminado');
			} else {
				if(req.body.vote === 'upvote'){
					await addUpvote(req);
					res.send('Voto añadido');
				} else if(req.body.vote === 'downvote'){
					await addDownvote(req);
					res.send('Voto añadido');
				}
			}
		} else {
			res.status(404).send('No se ha encontrado esa sugerencia');
		}
	} else {
		res.status(404).send('No se ha encontrado ese server');
	}
});


/**************************************/


// Eliminar sugerencia
// RECIBO: ID (URL), Mensaje ID (URL)
router.delete('/:serverId/:msgId/vote', async (req: any, res: any) => {
	const getData = await server.findOne({ id: req.params.serverId });

	if(getData){
		const getSug = getData.suggest.suggestions.find(sug => sug.msgId === req.params.msgId);
		
		if(getSug){
			const findUpvote = getSug.voters.upvote.find((voter: any) => voter.id == req.body.userId)
			const findDownvote = getSug.voters.downvote.find((voter: any) => voter.id == req.body.userId)

			
			if(!findUpvote && !findDownvote){
				res.status(400).send('No h880947411432923136as votado esta sugerencia');
			} else {
				if(findUpvote){
					
					res.send('Voto eliminado');

				} else if(findDownvote){
					
					res.send('Voto eliminado');
				}
			}
			
		} else {
			res.status(404).send('No se ha encontrado esa sugerencia');
		}
	} else {
		res.status(404).send('No se ha encontrado ese server')
	}
});


/**************************************/


// aprobar/denegar sugerencia
// RECIBO: ID (URL), Mensaje ID (URL), aprobar/denegar (body)
router.post('/:serverId/:msgId/approve', async (req: any, res: any) => {
	const getData = await server.findOne({ id: req.params.serverId });

	if(getData){
		const getSug = getData.suggest.suggestions.find(sug => sug.msgId === req.params.msgId);

		if(getSug){
			const data = await server.findOneAndUpdate(
				{ id: req.params.serverId },
				{
					suggest: {
						suggestions: {
							$find: {
								msgId: req.params.msgId
							},
							status: req.body.status
						}
					}
					
				}
			);

			if(data){
				res.send('Sugerencia actualizada');
			}
		}
	}
});

export default router;