import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import swaggerUi from 'swagger-ui-express';

import userRoutes from './modules/users/user.routes.js';
import authRoutes from './modules/auth/auth.routes.js';

import {
    swaggerSpec,
} from './config/swagger.js';

import {
    errorMiddleware,
} from './shared/middleware/error.middleware.js';


const app = express();


app.use(
    helmet(),
);

app.use(
    cors(),
);

app.use(
    compression(),
);

app.use(
    express.json(),
);

app.use(
    express.urlencoded({
        extended: true,
    }),
);


/*
|--------------------------------------------------------------------------
| Swagger
|--------------------------------------------------------------------------
*/

app.use(
    '/api-docs',

    swaggerUi.serve,

    swaggerUi.setup(
        swaggerSpec,
    ),
);


/*
|--------------------------------------------------------------------------
| Health
|--------------------------------------------------------------------------
*/

app.get(
    '/health',

    (
        req,
        res,
    ) => {

        res.status(200).json({

            success: true,

            service:
                'identity-service',

            status:
                'healthy',

        });

    },
);


/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.use(
    '/api/v1/users',
    userRoutes,
);
app.use(
    '/api/v1/auth',
    authRoutes,
);


/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.use(
    (
        req,
        res,
    ) => {

        return res
            .status(404)
            .json({

                success: false,

                message:
                    'Endpoint not found',

            });
    },
);


/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use(
    errorMiddleware,
);


export default app;