import { Request, Response } from 'express';
import {
    registerUserService,
    verifyEmailTokenService,
    loginUserService,
    logoutUserService,
    forgetPasswordService,
    resetPasswordService,
    resendEmailService
} from '../services/authServices';
import { IRequestWithUser } from "../interfaces/globalInterface";

// Controller for user registration
export const registerController = async (req: Request, res: Response) => {
    try {
        const { email, password, username } = req.body;
        await registerUserService(email, password, username); // Call the service to register user
        res.status(201).json({ message: 'Please check your email to verify account' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Controller for verifying the email token
export const verifyEmailController = async (req: Request, res: Response) => {
    try {
        const { token } = req.query;
        await verifyEmailTokenService(token as string); // Call the service to verify the token
        res.redirect(302, 'http://localhost:3000/auth/login');
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Controller for resend email
export const resendEmailController = async (req: Request, res: Response) => {
    try {
        const { email, emailType } = req.body;
        await resendEmailService(email, emailType);
        res.json({ message: 'resend successfully' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Controller for logging in the user
export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const { token, userId } = await loginUserService(email, password);

        res.json({ token, userId });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Controller for logging out the user
// Requires the request object to include the user details
export const logoutController = async (req: IRequestWithUser, res: Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Extract token from authorization header
        if (!token) {
            res.status(401).json({ message: 'Unauthorized request' });
            return;
        }

        await logoutUserService(token); // Call the service to log out the user
        res.json({ message: 'Logout successful' });
    } catch (error: any) {
        res.status(500).json({ message: 'Logout failed', error: error.message });
    }
};

// Controller for initiating the password reset process
export const forgotPasswordController = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        await forgetPasswordService(email); // Call the service to send a password reset email
        res.json({ message: 'Password reset email has been sent, please check your email' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Controller for resetting the user's password
export const resetPasswordController = async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;
        await resetPasswordService(token, newPassword); // Call the service to reset the password
        res.json({ message: 'Password reset successful, you can login now' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};