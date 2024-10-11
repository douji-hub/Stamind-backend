export const authSwagger = {
    // GET
    '/auth/verifyEmail/{token}': {
        get: {
            summary: 'Verify email using a token',
            tags: ['Auth'],
            parameters: [
                {
                    in: 'path',
                    name: 'token',
                    schema: {
                        type: 'string',
                    },
                    required: true,
                    description: 'Email verification token',
                },
            ],
            responses: {
                200: {
                    description: 'Account verification successful',
                },
                400: {
                    description: 'Invalid token or verification failed',
                },
            },
        },
    },

    // POST
    '/auth/register': {
        post: {
            summary: 'Register a new user',
            tags: ['Auth'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['email', 'password', 'username'],
                            properties: {
                                email: { type: 'string', example: 'user@example.com' },
                                password: { type: 'string', example: 'password123' },
                                username: { type: 'string', example: 'Jim' },
                            },
                        },
                    },
                },
            },
            responses: {
                201: { description: 'The data has been written into the database and needs to be verified' },
                400: { description: 'Invalid input or registration error' },
            },
        },
    },

    '/auth/login': {
        post: {
            summary: 'Login a user',
            tags: ['Auth'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['email', 'password'],
                            properties: {
                                email: {
                                    type: 'string',
                                    example: 'user@example.com',
                                },
                                password: {
                                    type: 'string',
                                    example: 'password123',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Successful login',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    token: {
                                        type: 'string',
                                        example: 'JWT token',
                                    },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Invalid email or password',
                },
            },
        },
    },

    '/auth/logout': {
        post: {
            summary: 'Logout a user',
            tags: ['Auth'],
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Logout successful',
                },
                401: {
                    description: 'Unauthorized request',
                },
                500: {
                    description: 'Logout failed',
                },
            },
        },
    },

    '/auth/forgotPassword': {
        post: {
            summary: 'Send password reset email',
            tags: ['Auth'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['email'],
                            properties: {
                                email: {
                                    type: 'string',
                                    example: 'user@example.com',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Password reset email has been sent',
                },
                400: {
                    description: 'Invalid email or request failed',
                },
            },
        },
    },

    '/auth/resetPassword': {
        post: {
            summary: 'Reset password',
            tags: ['Auth'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['token', 'newPassword'],
                            properties: {
                                token: {
                                    type: 'string',
                                    example: 'reset-token',
                                },
                                newPassword: {
                                    type: 'string',
                                    example: 'newpassword123',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Password reset successful, you can login now',
                },
                400: {
                    description: 'Invalid token or password reset failed',
                },
            },
        },
    },
};
