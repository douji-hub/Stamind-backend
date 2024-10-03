import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password_hash: string;
    username: string;
    is_verified: boolean;
    verification_token?: string;
    verification_token_expires_at?: Date;
    password_reset_token?: string;
    password_reset_expires_at?: Date;
    last_login_time?: Date;
    spaces: mongoose.Types.ObjectId[];
<<<<<<< HEAD
    session_tokens: string[];
    nowSpace: number;
=======
    blocks: mongoose.Types.ObjectId[];
    // ?: use Token to implement SSO, but may remove statelessness
    session_tokens: string[];
>>>>>>> 66bb2a8 (feat: use Token to implement SSO, but may remove statelessness (To be discussed))
}

const UserSchema: Schema<IUser> = new Schema({
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    username: { type: String, required: true },
    is_verified: { type: Boolean, default: false },
    verification_token: { type: String },
    verification_token_expires_at: { type: Date },
    password_reset_token: { type: String },
    password_reset_expires_at: { type: Date },
    last_login_time: { type: Date },
    spaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Space' }],
<<<<<<< HEAD
    session_tokens: [{ type: String }],
    nowSpace: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true
=======
    blocks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Block' }],
    // ?: use Token to implement SSO, but may remove statelessness
    session_tokens: [{ type: String }],
>>>>>>> 66bb2a8 (feat: use Token to implement SSO, but may remove statelessness (To be discussed))
});

export default mongoose.model<IUser>('User', UserSchema);
