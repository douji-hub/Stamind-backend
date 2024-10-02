import mongoose, { Document, Schema } from "mongoose";

interface ISpace extends Document {
    spaceId: string,
    blocks: mongoose.Types.ObjectId[];
    nowBlock: number,
}

const spaceSchema = new Schema<ISpace>({
    spaceId: {
        type: String,
        required: true,
    },
    blocks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Block'
    }],
    nowBlock: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
})

export default mongoose.model<ISpace>('spaces', spaceSchema)