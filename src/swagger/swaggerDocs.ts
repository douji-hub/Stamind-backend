import { authSwagger } from './authSwagger';

const PORT = 3001;

export const swaggerDocs = {
    openapi: '3.0.0',
    info: {
        title: 'StaMind API',
        version: '1.0.0',
        description: 'API documentation',
    },
    servers: [
        {
            url: `http://localhost/api`,
            description: 'Local server'
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
    paths: {
        ...authSwagger,
    },
};
