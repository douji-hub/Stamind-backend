import mongoose, {Document, Schema} from "mongoose"

interface IUser extends Document {
    userId: string,
    username: string,
    account: string,
    password: string,
    spaces: Array<string>,
    nowSpace: number,
    verificationToken: string,
    verificationTokenExpire: Date,
    isValid: boolean
}

const userSchema = new Schema<IUser>({
    userId: {
        type: String,
        unique: true,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    account: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    spaces: {
        type: [String],
        required: true,
    },
    nowSpace: {
        type: Number,
        required: true,
    },
    verificationToken: {
        type: String,
        required: true
    },
    verificationTokenExpire: {
        type: Date,
        required: true
    },
    isValid: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true,
})


export default mongoose.model<IUser>('users', userSchema);