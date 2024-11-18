export const blockSwagger = {
    // GET: Get all Blocks under a Space
    '/block/{spaceId}/blocks': {
        get: {
            summary: 'Retrieve all blocks under a specific space',
            tags: ['Block'],
            parameters: [
                {
                    in: 'path',
                    name: 'spaceId',
                    schema: {
                        type: 'string',
                    },
                    required: true,
                    description: 'The ID of the space',
                },
            ],
            responses: {
                200: {
                    description: 'Blocks retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    $ref: '#/components/schemas/Block',
                                },
                            },
                        },
                    },
                },
                500: {
                    description: 'Error occurred while retrieving blocks',
                },
            },
            security: [{ bearerAuth: [] }],
        },
    },

    '/block/{blockId}': {
        get: {
            summary: 'Retrieve block details by ID',
            tags: ['Block'],
            parameters: [
                {
                    in: 'path',
                    name: 'blockId',
                    schema: {
                        type: 'string',
                    },
                    required: true,
                    description: 'The ID of the block',
                },
            ],
            responses: {
                200: {
                    description: 'Block details retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Block',
                            },
                        },
                    },
                },
                404: {
                    description: 'Block not found',
                },
            },
            security: [{ bearerAuth: [] }],
        },
        put: {
            summary: 'Update a block by ID',
            tags: ['Block'],
            parameters: [
                {
                    in: 'path',
                    name: 'blockId',
                    schema: {
                        type: 'string',
                    },
                    required: true,
                    description: 'The ID of the block',
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                blockName: {
                                    type: 'string',
                                    example: 'Updated Block Name',
                                },
                                blockContent: {
                                    type: 'string',
                                    example: 'Updated block content',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Block updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Block',
                            },
                        },
                    },
                },
                400: {
                    description: 'Error occurred while updating the block',
                },
            },
            security: [{ bearerAuth: [] }],
        },
    },


    // POST: Create a new Block
    '/block/{spaceId}/createBlock': {
        post: {
            summary: 'Create a new block under a specific space',
            tags: ['Block'],
            parameters: [
                {
                    in: 'path',
                    name: 'spaceId',
                    schema: {
                        type: 'string',
                    },
                    required: true,
                    description: 'The ID of the space where the block will be created',
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['blockName', 'blockType'],
                            properties: {
                                blockName: {
                                    type: 'string',
                                    example: 'New Block',
                                },
                                blockType: {
                                    type: 'string',
                                    enum: ['block_note', 'block_coding', 'block_LLM'],
                                    example: 'block_note',
                                },
                                blockContent: {
                                    type: 'string',
                                    example: 'Initial content of the block',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: 'Block successfully created',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Block',
                            },
                        },
                    },
                },
                400: {
                    description: 'Error occurred while creating the block',
                },
            },
            security: [{ bearerAuth: [] }],
        },
    },

    // POST: Generate a PIN code for a Block
    '/block/{blockId}/generatePin': {
        post: {
            summary: 'Generate a PIN code to share a block',
            tags: ['Block'],
            parameters: [
                {
                    in: 'path',
                    name: 'blockId',
                    schema: {
                        type: 'string',
                    },
                    required: true,
                    description: 'The ID of the block',
                },
            ],
            responses: {
                200: {
                    description: 'PIN code generated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        example: 'PIN code generated',
                                    },
                                    coWorkId: {
                                        type: 'string',
                                        example: '123456',
                                    },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: 'Error occurred while generating the PIN code',
                },
            },
            security: [{ bearerAuth: [] }],
        },
    },

    // POST: Join a shared Block using a PIN code
    '/block/join': {
        post: {
            summary: 'Join a shared block using a PIN code',
            tags: ['Block'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['pinCode'],
                            properties: {
                                pinCode: {
                                    type: 'string',
                                    example: '123456',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Successfully joined the shared block',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Block',
                            },
                        },
                    },
                },
                400: {
                    description: 'Invalid PIN code or block is not shared',
                },
            },
            security: [{ bearerAuth: [] }],
        },
    },

    // POST: Initialize WebSocket for a Block
    '/block/initializeBlockSocket': {
        post: {
            summary: 'Initialize WebSocket for a block',
            tags: ['Block'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['blockId'],
                            properties: {
                                blockId: {
                                    type: 'string',
                                    example: '60d5ec49c0d6b34d887af123',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'WebSocket initialized successfully for the block',
                },
                500: {
                    description: 'Error occurred while initializing WebSocket',
                },
            },
            security: [{ bearerAuth: [] }],
        },
    },

};
