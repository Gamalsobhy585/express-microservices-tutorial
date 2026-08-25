import type {
    Request,
    Response,
    NextFunction,
} from 'express';

import {
    type ZodObject,
    ZodError,
} from 'zod';

export const validate =
    (schema: ZodObject) =>
    async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {

        try {

            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            next();

        } catch (error) {

            if (error instanceof ZodError) {

                return res.status(422).json({
                    success: false,

                    message:
                        'Validation failed',

                    errors:
                        error.flatten(),
                });
            }

            next(error);
        }
    };