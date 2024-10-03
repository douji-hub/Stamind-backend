import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    username: string;
    isVerified: boolean;
    verificationToken?: string;
    verificationTokenExpiresAt?: Date;
    passwordResetToken?: string;
    passwordResetExpiresAt?: Date;
    lastLoginTime?: Date;
    spaces: mongoose.Types.ObjectId[];
    sessionTokens?: string[];
    nowSpace?: number;
}

const UserSchema: Schema<IUser> = new Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    username: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiresAt: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpiresAt: { type: Date },
    lastLoginTime: { type: Date },
    spaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Space' }],
    sessionTokens: [{ type: String }],
    nowSpace: {
        type: Number
    },
}, {
    timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
