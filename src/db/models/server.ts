import { Schema, model, Document } from 'mongoose';

// El esquema está en Figma
interface IServer extends Document {
	id: string, // OBLIGATORIO para reconocer el server

    // SISTEMA DE SUGERENCIAS
    suggest: {
        enabled: boolean,
        channelId: string
    }
}


const schema = new Schema<IServer>({
    id: { type: String, required: true },

    // SISTEMA DE SUGERENCIAS
    suggest: {
        enabled: { type: Boolean, required: true },
        channelId: { type: String, required: true }
    }
});


export const server = model<IServer>('Server', schema);