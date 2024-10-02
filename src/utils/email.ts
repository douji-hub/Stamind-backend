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

