import { Schema, model, Document } from 'mongoose';

interface IWarn extends Document {
	user: string,
	reason: string
}


const schema = new Schema<IWarn>({
	user: { type: String, required: true },
	reason: { type: String, required: false }
});


export const warn = model<IWarn>('Warn', schema);