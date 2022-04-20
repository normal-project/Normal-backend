import { Schema, model, Document } from 'mongoose';

// El esquema está en Figma
interface IServer extends Document {
	serverId: string, // OBLIGATORIO para reconocer el server

	// SISTEMA DE SUGERENCIAS
	suggest: {
		enabled: boolean,
		channelId: string,
		suggestions: [{
			msgId: string,
			suggest: string,
			voters: {
				upvote: string[],
				downvote: string[]
			}
		}]
	},

	// SISTEMA DE MODERACIÓN
	moderation: {
		automod: boolean
	}
}


const schema = new Schema<IServer>({
	serverId: String,

	// SISTEMA DE SUGERENCIAS
	suggest: {
		enabled: String,
		channelId: String,
		suggestions: [{
			msgId: String,
			suggest: String,
			voters: {
				upvote: [String],
				downvote: [String]
			}
		}]
	},

	// SISTEMA DE MODERACIÓN
	moderation: {
		automod: String
	}
});

export const server = model<IServer>('Server', schema);