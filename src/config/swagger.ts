import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {

    definition: {

        openapi: '3.0.0',

        info: {

            title:
                'Identity Service API',

            version:
                '1.0.0',

            description:
                'Authentication, Users, Roles and Permissions Microservice',

        },

        servers: [

            {
                url:
                    'http://localhost:3000/api/v1',

                description:
                    'Local development',
            },

        ],

        components: {

            securitySchemes: {

                bearerAuth: {

                    type:
                        'http',

                    scheme:
                        'bearer',

                    bearerFormat:
                        'JWT',

                },

            },

        },

    },

    apis: [

        './src/modules/**/*.routes.ts',
        './src/modules/**/*.ts',

    ],

};


export const swaggerSpec =
    swaggerJsdoc(
        options,
    );