import mongoose, { Schema, Document } from 'mongoose';

export interface IBlock extends Document {
    spaceId: mongoose.Types.ObjectId;
    blockName: string
    isCoWork: boolean;
    coWorkId?: string
    coworkers: mongoose.Types.ObjectId[];
    blockContent: string;
    blockType: string;
    createdAt: Date;
    updatedAt: Date;
}

const BlockSchema: Schema = new Schema({
    spaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Space', required: true },
    blockName: { type: String, required: true },
    isCoWork: { type: Boolean, default: false },
    coWorkId: { type: String },
    coworkers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    blockContent: { type: String, default: '' },
    blockType: { type: String, enum: ['block_note', 'block_coding', 'block_LLM'], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBlock>('Block', BlockSchema);