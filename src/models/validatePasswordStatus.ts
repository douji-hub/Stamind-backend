import mongoose, {Document, Schema} from "mongoose"

// 定義 TypeScript 介面來描述資料結構
export interface IValidatePasswordStatus extends Document {
    userId: string;
    expireTime: Date;
    account: string;
    token: string;
    isValid: boolean;
}

const validatePasswordStatusSchema = new Schema<IValidatePasswordStatus>({
    userId: {
        type: String,
        unique: true,
        required: true,
    },
    expireTime: {
        type: Date,
        required: true
    },
    account: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    isValid: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true,
});


export default mongoose.model<IValidatePasswordStatus>('ValidatePasswordStatus', validatePasswordStatusSchema);