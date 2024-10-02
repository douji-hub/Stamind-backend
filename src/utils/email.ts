import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendVerificationEmail = async (to: string, token: string) => {
    try {
        const verificationLink = `http://your-domain.com/api/auth/verify-email/${token}`;

        await transporter.sendMail({
            from: '"StackMind" <no-reply@example.com>',
            to,
            subject: 'Please Verify your email',
            html: `<p>Please click on the link below to verify your email：</p><a href="${verificationLink}">${verificationLink}</a>`,
        })
    } catch (error) {
        console.error('Failed to send password reset email:', error);
        throw error;
    };
};

