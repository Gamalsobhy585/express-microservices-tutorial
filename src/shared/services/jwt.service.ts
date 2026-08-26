import crypto from 'crypto';

import jwt from 'jsonwebtoken';

import type {
    JwtPayload,
    SignOptions,
} from 'jsonwebtoken';

import {
    AppError,
} from '../errors/AppError.js';


export interface AccessTokenPayload {
    userId: number;

    email: string;
}


export interface RefreshTokenPayload {
    userId: number;

    type: 'refresh';
}


type JwtExpiresIn =
    NonNullable<
        SignOptions['expiresIn']
    >;


export class JwtService {

    private static getAccessSecret(): string {

        const secret =
            process.env.JWT_ACCESS_SECRET;


        if (!secret) {

            throw new Error(
                'JWT_ACCESS_SECRET is not defined',
            );
        }


        return secret;
    }


    private static getRefreshSecret(): string {

        const secret =
            process.env.JWT_REFRESH_SECRET;


        if (!secret) {

            throw new Error(
                'JWT_REFRESH_SECRET is not defined',
            );
        }


        return secret;
    }


    static generateAccessToken(
        payload: AccessTokenPayload,
    ): string {

        const expiresIn =
            (
                process.env.JWT_ACCESS_EXPIRES_IN
                ?? '15m'
            ) as JwtExpiresIn;


        return jwt.sign(
            payload,
            this.getAccessSecret(),
            {
                expiresIn,

                jwtid:
                    crypto.randomUUID(),

                issuer:
                    'identity-service',
            },
        );
    }


    static generateRefreshToken(
        payload: RefreshTokenPayload,
    ): string {

        const expiresIn =
            (
                process.env.JWT_REFRESH_EXPIRES_IN
                ?? '7d'
            ) as JwtExpiresIn;


        return jwt.sign(
            payload,
            this.getRefreshSecret(),
            {
                expiresIn,

                jwtid:
                    crypto.randomUUID(),

                issuer:
                    'identity-service',
            },
        );
    }


    static verifyAccessToken(
        token: string,
    ): JwtPayload & AccessTokenPayload {

        try {

            return jwt.verify(
                token,
                this.getAccessSecret(),
                {
                    issuer:
                        'identity-service',
                },
            ) as JwtPayload
                & AccessTokenPayload;

        } catch {

            throw new AppError(
                'Invalid or expired access token',
                401,
            );
        }
    }


    static verifyRefreshToken(
        token: string,
    ): JwtPayload & RefreshTokenPayload {

        try {

            const decoded =
                jwt.verify(
                    token,
                    this.getRefreshSecret(),
                    {
                        issuer:
                            'identity-service',
                    },
                ) as JwtPayload
                    & RefreshTokenPayload;


            if (
                decoded.type
                !== 'refresh'
            ) {

                throw new AppError(
                    'Invalid refresh token',
                    401,
                );
            }


            return decoded;

        } catch (error) {

            if (
                error instanceof AppError
            ) {

                throw error;
            }


            throw new AppError(
                'Invalid or expired refresh token',
                401,
            );
        }
    }


    /*
     * Never store the raw refresh token
     * in the database.
     */
    static hashToken(
        token: string,
    ): string {

        return crypto
            .createHash(
                'sha256',
            )
            .update(
                token,
            )
            .digest(
                'hex',
            );
    }


    static getRefreshTokenExpiration(
        token: string,
    ): Date {

        const decoded =
            jwt.decode(
                token,
            ) as JwtPayload | null;


        if (
            !decoded
            ||
            !decoded.exp
        ) {

            throw new AppError(
                'Invalid refresh token',
                401,
            );
        }


        return new Date(
            decoded.exp * 1000,
        );
    }
}