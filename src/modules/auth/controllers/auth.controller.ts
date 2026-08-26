import type {
    NextFunction,
    Request,
    Response,
} from 'express';
import type { VerifyEmailDto } from '../dto/verify-email.dto.js';
import type { ResendOtpDto } from '../dto/resend-otp.dto.js';
import type {
    RegisterDto,
} from '../dto/register.dto.js';

import   {
    AuthService,
} from '../services/auth.service.js';

import {
    AuthResource,
} from '../resources/auth.resource.js';
import type { LoginDto } from '../dto/login.dto.js';

export class AuthController {

    constructor(
        private readonly authService:
            AuthService,
    ) {}


    register = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {

        try {

            const dto: RegisterDto = {

                name_en:
                    req.body.nameEn,

                name_ar:
                    req.body.nameAr,

                email:
                    req.body.email,

                password:
                    req.body.password,

                role:
                    req.body.role,
            };


            const user =
                await this.authService
                    .register(
                        dto,
                        {
                            ipAddress:
                                req.ip ?? null,

                            userAgent:
                                req.get(
                                    'user-agent',
                                ) ?? null,
                        },
                    );


            return res
                .status(201)
                .json({

                    success:
                        true,

                    message:
                        'Registration successful. Please verify your email using the OTP sent to you.',

                    data:
                        AuthResource
                            .registeredUser(
                                user,
                            ),
                });

        } catch (error) {

            next(
                error,
            );
        }
    };
    verifyEmail = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {

        try {

            const dto: VerifyEmailDto = {

                email:
                    req.body.email,

                otp:
                    req.body.otp,

            };


            const user =
                await this.authService
                    .verifyEmail(
                        dto,
                        {
                            ipAddress:
                                req.ip ?? null,

                            userAgent:
                                req.get(
                                    'user-agent',
                                    ) ?? null,
                        },
                    );


            return res
                .status(200)
                .json({

                    success:
                        true,

                    message:
                        'Email verified successfully',

                    data:
                        AuthResource
                            .registeredUser(
                                user,
                            ),

                });

        } catch (error) {

            next(
                error,
            );
        }
    };

    resendOtp = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {

        try {

            const dto: ResendOtpDto = {

                email:
                    req.body.email,

            };


            const result =
                await this.authService
                    .resendVerificationOtp(
                        dto,
                        {
                            ipAddress:
                                req.ip ?? null,

                            userAgent:
                                req.get(
                                    'user-agent',
                                    ) ?? null,
                        },
                    );


            return res
                .status(200)
                .json({

                    success:
                        true,

                    message:
                        'OTP sent successfully',

                    data:
                        result,

                });

        } catch (error) {

            next(
                error,
            );
        }
    };
    login = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {

        try {

            const dto: LoginDto = {

                email:
                    req.body.email,

                password:
                    req.body.password,

            };


            const result =
                await this.authService.login(
                    dto,
                    {
                      ipAddress:
                                req.ip ?? null,

                        userAgent:
                                req.get(
                                    'user-agent',
                                    ) ?? null,
                    },
                );


            /*
            * Refresh token is NOT sent
            * inside the JSON body.
            */
            res.cookie(
                'refresh_token',
                result.refreshToken,
                {
                    httpOnly:
                        true,

                    secure:
                        process.env.NODE_ENV
                        === 'production',

                    sameSite:
                        'strict',

                    maxAge:
                        Number(
                            process.env
                                .JWT_REFRESH_COOKIE_MAX_AGE_MS
                            ?? 604800000,
                        ),

                    path:
                        '/api/v1/auth',
                },
            );


            return res
                .status(200)
                .json({

                    success:
                        true,

                    message:
                        'Login successful',

                    data: {

                        user:
                            AuthResource
                                .authenticatedUser(
                                    result.user,
                                ),

                        accessToken:
                            result.accessToken,

                        tokenType:
                            'Bearer',

                    },

                });

        } catch (error) {

            next(
                error,
            );
        }
    };
    me = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {

        try {

            if (
                !req.user
            ) {

                throw new Error(
                    'Authenticated user is missing',
                );
            }


            const user =
                await this.authService
                    .getMe(
                        req.user.id,
                    );


            return res
                .status(200)
                .json({

                    success:
                        true,

                    message:
                        'User information retrieved successfully',

                    data:
                        AuthResource
                            .authenticatedUser(
                                user,
                            ),

                });

        } catch (error) {

            next(
                error,
            );
        }
    };
}