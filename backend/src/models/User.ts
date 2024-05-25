import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import mongoose from 'mongoose';

const { Types } = mongoose;

class User {
	@prop({ required: true })
	public email?: string;

	@prop({ required: true, select: false })
	public passwordHash?: string;

	@prop()
	public profilePicture?: string;

	@prop({ required: true, select: false, default: [] })
	public experiencePoints?: {points: number, timestamp: Date}[];

	@prop({ ref: () => 'Community', type: () => Types.ObjectId })
	public community?: Ref<typeof Types.ObjectId>;
}

export const UserModel = getModelForClass(User);