import type {
    Request,
    Response,
    NextFunction,
} from 'express';

import {
    AppError,
} from '../errors/AppError.js';

export const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {

    if (
        error instanceof AppError
    ) {

        return res
            .status(
                error.statusCode,
            )
            .json({

                success: false,

                message:
                    error.message,

                details:
                    error.details,
            });
    }


    console.error(
        error,
    );


    return res
        .status(500)
        .json({

            success: false,

            message:
                'Internal server error',

        });
};