import { Schema, model, Document } from 'mongoose';

// El esquema está en Figma
interface IServer extends Document {
	id: string, // OBLIGATORIO para reconocer el server

	// SISTEMA DE SUGERENCIAS
	suggest: {
		enabled: boolean,
		channelId: string,
		suggestions: [{
			msgId: string,
			date: Date,
			status: string,
			voters: {
				upvote: string[],
				downvote: string[]
			}
		}]
	}
}


const schema = new Schema<IServer>({
	id: { type: String, required: true },

	// SISTEMA DE SUGERENCIAS
	suggest: {
		enabled: String,
		channelId: String,
		suggestions: [{
			msgId: String,
			suggest: String,
			date: Date,
			status: String, // o es "emited" o "approved" o "denied"
			voters: {
				upvote: [String],
				downvote: [String]
			}
		}]
	}
});

export const server = model<IServer>('Server', schema);