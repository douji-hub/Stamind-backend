import nodemailer from 'nodemailer';


export const sendVerificationEmail = async (to: string, token: string) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        const verificationLink = `http://localhost:3001/api/auth/verifyEmail/${token}`;

        await transporter.sendMail({
            from: '"StackMind" <no-reply@example.com>',
            to,
            subject: 'Please Verify your email',
            html: `<p>Please click on the link below to verify your email：</p><a href="${verificationLink}">${verificationLink}</a>`,
        })
    } catch (error) {
        console.error('Failed to send verification email:', error);
        throw error;
    };
};


export const sendForgetPasswordEmail = async (to: string, token: string) => {

    // !: Need to switch to the frontend password reset page with token
    // !: The frontend page needs to be called http://localhost:3001/api/auth/resetPassword with token and new password
    const resetLink = `https://www.youtube.com/watch?v=1SPM98_XU2c`;

    await transporter.sendMail({
        from: '"StackMind" <no-reply@example.com>',
        to,
        subject: 'Reset your password',
        html: `<p>Please click the link below to reset your password：</p><a href="${resetLink}">${resetLink}</a>`,
    });
};