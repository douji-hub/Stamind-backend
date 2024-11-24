export const authSwagger = {
    // Other endpoints...

    // POST and DELETE /sessions - User login and logout
    '/sessions': {
        post: {
            summary: 'User login',
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
                    description: 'Login successful',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    token: {
                                        type: 'string',
                                        example: 'JWT token',
                                    },
                                    userId: {
                                        type: 'string',
                                        example: '60d0fe4f5311236168a109ca',
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
        delete: {
            summary: 'User logout',
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

    // Other endpoints...

    // Ensure other paths are unique and don't have duplicate keys
    '/users': {
        post: {
            summary: 'Register a new user',
            tags: ['Auth'],
            // ... rest of the definition
        },
    },

    '/users/verify': {
        post: {
            summary: 'Verify user email using a token',
            tags: ['Auth'],
            // ... rest of the definition
        },
    },

    '/users/resend-verification': {
        post: {
            summary: 'Resend verification email',
            tags: ['Auth'],
            // ... rest of the definition
        },
    },

    '/password-resets': {
        post: {
            summary: 'Initiate password reset process',
            tags: ['Auth'],
            // ... rest of the definition
        },
    },

    '/password-resets/{token}': {
        put: {
            summary: 'Reset password using a token',
            tags: ['Auth'],
            parameters: [
                {
                    in: 'path',
                    name: 'token',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'Password reset token',
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['newPassword'],
                            properties: {
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
                    description: 'Password reset successful, you can now login',
                },
                400: {
                    description: 'Invalid token or password reset failed',
                },
            },
        },
    },
};
