import mongoose, { Document, Schema } from "mongoose";

export interface ISpace extends Document {
    blocks: mongoose.Types.ObjectId[]; // List of block IDs belonging to the space
    createdAt: Date;
    updatedAt: Date;
}

const SpaceSchema: Schema = new Schema({
    blocks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Block' }], // Reference to associated blocks
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<ISpace>('Space', SpaceSchema);
