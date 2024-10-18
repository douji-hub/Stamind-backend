import bcrypt from 'bcryptjs';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail, sendForgetPasswordEmail } from '../utils/email';

/**
 * @desc Register
 * @param email user's email
 * @param password user's password
 * @param username user's username
 * @throws throw an error when email is registered
 */
export const registerUserService = async (email: string, password: string, username: string): Promise<void> => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('This email has been registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = new User({
        email,
        passwordHash,
        username,
        isVerified: false,
        verificationToken,
        verificationTokenExpiresAt,
        spaces: [],

        // ?: use Token to implement SSO, but may remove statelessness
        sessionTokens: "",

    });

    await user.save();

    // send verification email
    await sendVerificationEmail(user.email, verificationToken);
};

/**
 * @desc Verify mail in Token
 * @param token generate from register function
 * @throws throw an error when token expired
 */
export const verifyEmailTokenService = async (token: string): Promise<void> => {
    const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) {
        throw new Error('Invalid or expired verification link');
    }

    user.isVerified = true;
    await user.save();
};

/**
 * @desc Login in email and password
 * @param email user's email
 * @param password user's password
 * @throws throw an error when invalid email or password
 * @throws throw an error when account not verify
 */
export const loginUserService = async (email: string, password: string): Promise<string> => {

    const JWT_SECRET: string = process.env.JWT_SECRET || '';

    const user = await User.findOne({ email });

    // check user
    if (!user) {
        throw new Error('Invalid email or password');
    } else {
        // check password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        // check account is verified
        if (!user.isVerified) {
            throw new Error('Account not verified yet, please check your email');
        }

        // JWT Token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        // update last login time and JWT Token
        user.lastLoginTime = new Date();

        // ?: use Token to implement SSO, but may remove statelessness
        user.sessionTokens = token

        await user.save();

        return token;
    }
};

/**
 * @desc Logout
 * @param username user's username
 * ------------------------------------------------------------
 * TODO: Record user information
 */
export const logoutUserService = async (token: string): Promise<void> => {

    const JWT_SECRET: string = process.env.JWT_SECRET || '';


    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    // ?: use Token to implement SSO, but may remove statelessness
    if (user) {
        user.sessionTokens = ''
        await user.save();
    }
};

/**
 * @desc Reset password
 * @param email user's email
 * @throws throw an error when no account for this email
 */
export const forgetPasswordService = async (email: string): Promise<void> => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('There is no account for this email');
    }

    const passwordResetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hour

    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpiresAt = passwordResetExpiresAt;
    await user.save();

    // send forget password email
    await sendForgetPasswordEmail(user.email, passwordResetToken);
};

/**
 * @desc Reset password
 * @param email user's email
 * @throws throw an error when invalid or expired password reset link
 */
export const resetPasswordService = async (token: string, newPassword: string): Promise<void> => {
    const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpiresAt: { $gt: new Date() },
    });

    if (!user) {
        throw new Error('Invalid or expired password reset link');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);

    await user.save();
};