export const spaceSwagger = {
    // POST: Create a new Space
    '/space/create': {
        post: {
            summary: 'Create a new space',
            tags: ['Space'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                userID: {
                                    type: 'string',
                                    example: '60d5ec49c0d6b34d887af123',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: 'Space created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    _id: { type: 'string', example: '60d5ec49c0d6b34d887af456' },
                                    blocks: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        example: [],
                                    },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Error occurred while creating the space',
                },
            },
            security: [{ bearerAuth: [] }],
        },
    },

    // GET: Get all spaces owned by a user
    '/space/list': {
        get: {
            summary: 'Get all spaces owned by a user',
            tags: ['Space'],
            parameters: [
                {
                    in: 'query',
                    name: 'userId',
                    schema: {
                        type: 'string',
                    },
                    required: true,
                    description: 'The ID of the user',
                },
            ],
            responses: {
                200: {
                    description: 'Spaces retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        _id: { type: 'string', example: '60d5ec49c0d6b34d887af456' },
                                        blocks: {
                                            type: 'array',
                                            items: { type: 'string' },
                                            example: ['60d5ec49c0d6b34d887af789'],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: 'User not found',
                },
            },
            security: [{ bearerAuth: [] }],
        },
    },

    // DELETE: Delete a Space
    '/space/{spaceId}': {
        delete: {
            summary: 'Delete a space by its ID and associated blocks',
            tags: ['Space'],
            parameters: [
                {
                    in: 'path',
                    name: 'spaceId',
                    schema: {
                        type: 'string',
                    },
                    required: true,
                    description: 'The ID of the space to delete',
                },
                {
                    in: 'query',
                    name: 'userId',
                    schema: {
                        type: 'string',
                    },
                    required: true,
                    description: 'The ID of the user requesting deletion',
                },
            ],
            responses: {
                200: {
                    description: 'Space and associated blocks deleted successfully',
                },
                404: {
                    description: 'Space not found or unauthorized',
                },
                500: {
                    description: 'Error occurred while deleting the space',
                },
            },
            security: [{ bearerAuth: [] }],
        },
    },
};
