import mongoose, {Document, Schema} from "mongoose";

interface ISpace extends Document {
    spaceId: string,
    blocks: Array<string>,
    nowBlock: number,
}

const spaceSchema = new Schema<ISpace>({
    spaceId: {
        type: String,
        required: true,
    },
    blocks: {
        type: [String],
        required: true
    },
    nowBlock: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
})

export default mongoose.model<ISpace>('spaces', spaceSchema)