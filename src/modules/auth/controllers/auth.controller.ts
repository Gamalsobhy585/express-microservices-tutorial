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

}