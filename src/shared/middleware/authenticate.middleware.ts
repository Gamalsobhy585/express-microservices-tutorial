import type {
    NextFunction,
    Request,
    Response,
} from 'express';

import {
    JwtService,
} from '../services/jwt.service.js';

import {
    AppError,
} from '../errors/AppError.js';


export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {

    try {

        const authorizationHeader =
            req.headers.authorization;


        if (
            !authorizationHeader
        ) {

            throw new AppError(
                'Authentication token is required',
                401,
            );
        }


        const [
            type,
            token,
        ] =
            authorizationHeader.split(
                ' ',
            );


        if (
            type !== 'Bearer'
            ||
            !token
        ) {

            throw new AppError(
                'Invalid authorization header',
                401,
            );
        }


        const payload =
            JwtService
                .verifyAccessToken(
                    token,
                );


        req.user = {

            id:
                payload.userId,

            email:
                payload.email,

        };


        next();

    } catch (error) {

        next(
            error,
        );
    }
};