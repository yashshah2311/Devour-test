import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import mongoose from 'mongoose';

const { Types } = mongoose;
class Community {
	@prop({ required: true })
	public name?: string;

	@prop()
	public logo?: string;

	@prop({ ref: () => 'User', type: () => Types.ObjectId })
	public members?: Ref<typeof Types.ObjectId>[];
}

export const CommunityModel = getModelForClass(Community);