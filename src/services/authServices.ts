import User, { IUser } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/**
 * @desc Register
 * @param email user's email
 * @param password user's password
 * @param username user's username
 * @throws throw an error when email is registered
 */
export const registerUser = async (email: string, password: string, username: string): Promise<void> => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('This email has been registered');
    }

    const password_hash = await bcrypt.hash(password, 10);

    const verification_token = crypto.randomBytes(32).toString('hex');
    const verification_token_expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = new User({
        email,
        password_hash,
        username,
        is_verified: false,
        verification_token,
        verification_token_expires_at,
        spaces: [],
        blocks: [],
        session_tokens: [],
    });

    await user.save();

    // send verification email
    await sendVerificationEmail(user.email, verification_token);
};

/**
 * @desc Verify mail in Token
 * @param token generate from register function
 * @throws throw an error when token expired
 */
export const verifyEmailToken = async (token: string): Promise<void> => {
    const user = await User.findOne({
        verification_token: token,
        verification_token_expires_at: { $gt: new Date() },
    });

    if (!user) {
        throw new Error('Invalid or expired verification link');
    }

    user.is_verified = true;
    // user.verification_token = undefined;
    // user.verification_token_expires_at = undefined;
    await user.save();
};
