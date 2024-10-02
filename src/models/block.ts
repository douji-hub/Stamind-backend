import mongoose, {Document, Schema} from "mongoose";

interface IBlockSetting {
    color: string,
    theme: string,
}

interface IBlockNote {
    noteContent: string,
    image: Array<string>,
}

interface IBlockCode {
    codeContent: string,
    codeType: string,
}

// interface IBlockAITree {
//     gptContent: object,
// }

interface IBlock extends Document {
    spaceId: string,
    blockId: string,
    blockName: string,
    blockSetting: IBlockSetting,
    isCowork: boolean,
    coworkId: string,
    blockContent: IBlockNote | IBlockCode,
    blockType: 'Note' | 'Code' | 'AITree',
}

const BlockSchema = new Schema<IBlock>({
    spaceId: {
        type: String,
        required: true,
    },
    blockId: {
        type: String,
        required: true
    },
    blockName: {
        type: String,
        required: true,
    },
    blockSetting: {
        color: {
            type: String,
            required: true,
        },
        theme: {
            type: String,
            required: true,
        }
        // TODO: 未來有增加可放於此
    },
    isCowork: {
        type: Boolean,
        required: true,
        default: false,
    },
    coworkId: {
        type: String,
        default: '',
    },
    blockContent: {
        type: Object,
        required: true,
    },
    blockType: {
        type: String,
        enum: ['Note', 'Code', 'AITree'],
        required: true
    }


}, {
    timestamps: true
})

export default mongoose.model<IBlock>('blocks', BlockSchema)