import  {
    AuthenticationAction,
    OtpType,
} from '../../../generated/prisma/client.js';

import type {
    RegisterDto,
} from '../dto/register.dto.js';
import type{
    VerifyEmailDto,
} from '../dto/verify-email.dto.js';

import type{
    ResendOtpDto,
} from '../dto/resend-otp.dto.js';


import type {
    IAuthRepository,
} from '../repositories/auth.repository.interface.js';

import  {
    PasswordUtil,
} from '../../../shared/utils/password.util.js';

import  {
    OtpService,
} from '../../../shared/services/otp.service.js';

import  {
    MailService,
} from '../../../shared/services/mail.service.js';

import  {
    AppError,
} from '../../../shared/errors/AppError.js';

export interface RegisterContext {

    ipAddress?: string | null;

    userAgent?: string | null;
}

export class AuthService {

    constructor(
        private readonly authRepository:
            IAuthRepository,
    ) {}


    async register(
        dto: RegisterDto,
        context: RegisterContext,
    ) {

        const existingUser =
            await this.authRepository
                .findUserByEmail(
                    dto.email,
                );


        if (existingUser) {

            throw new AppError(
                'Email already exists',
                409,
            );
        }


        const role =
            await this.authRepository
                .findRoleByName(
                    dto.role,
                );


        if (!role) {

            throw new AppError(
                'Role not found',
                400,
            );
        }


        const hashedPassword =
            await PasswordUtil.hash(
                dto.password,
            );


        const user =
            await this.authRepository
                .createUser({

                    name_en:
                        dto.name_en,

                    name_ar:
                        dto.name_ar,

                    email:
                        dto.email,

                    password:
                        hashedPassword,
                });


        await this.authRepository
            .attachRoleToUser(
                user.id,
                role.id,
            );


        const otp =
            OtpService.generate();


        const otpHash =
            await OtpService.hash(
                otp,
            );


        const expiresAt =
            OtpService
                .getExpirationDate();


        await this.authRepository
            .createOtp({

                userId:
                    user.id,

                codeHash:
                    otpHash,

                type:
                    OtpType
                        .EMAIL_VERIFICATION,

                expiresAt,
            });


        await this.authRepository
            .createAuthenticationLog({

                userId:
                    user.id,

                action:
                    AuthenticationAction
                        .REGISTER,

                success:
                    true,

                ipAddress:
                    context.ipAddress ?? null,

                userAgent:
                    context.userAgent ?? null,

                message:
                    'User registered successfully',
            });


        await MailService
            .sendVerificationOtp(
                user.email,
                otp,
            );


        return user;
    }
    async verifyEmail(
        dto: VerifyEmailDto,
        context: RegisterContext,
    ) {

        const user =
            await this.authRepository
                .findUserByEmail(
                    dto.email,
                );


        if (!user) {

            throw new AppError(
                'User not found',
                404,
            );
        }


        if (
            user.emailVerifiedAt
        ) {

            throw new AppError(
                'Email is already verified',
                400,
            );
        }


        const otp =
            await this.authRepository
                .findLatestValidOtp(

                    user.id,

                    OtpType
                        .EMAIL_VERIFICATION,

                );


        if (!otp) {

            throw new AppError(
                'OTP is invalid or expired',
                400,
            );
        }


        const isOtpValid =
            await OtpService.verify(
                dto.otp,
                otp.codeHash,
            );


        if (!isOtpValid) {

          await this.authRepository.createAuthenticationLog({
                userId: user.id,

                action: AuthenticationAction.VERIFY_EMAIL,

                success: false,

                ipAddress: context.ipAddress ?? null,

                userAgent: context.userAgent ?? null,

                message: 'Invalid email verification OTP',
            });


            throw new AppError(
                'Invalid OTP',
                400,
            );
        }


        const verifiedUser =
            await this.authRepository
                .verifyEmail(
                    user.id,
                    otp.id,
                );


        await this.authRepository.createAuthenticationLog({
            userId: user.id,

            action: AuthenticationAction.VERIFY_EMAIL,

            success: false,

            ipAddress: context.ipAddress ?? null,

            userAgent: context.userAgent ?? null,

            message: 'Invalid email verification OTP',
        });


        return verifiedUser;
    }
async resendVerificationOtp(
    dto: ResendOtpDto,
    context: RegisterContext,
) {

    const user =
        await this.authRepository
            .findUserByEmail(
                dto.email,
            );


    if (!user) {

        throw new AppError(
            'User not found',
            404,
        );
    }


    if (
        user.emailVerifiedAt
    ) {

        throw new AppError(
            'Email is already verified',
            400,
        );
    }


    const lastOtp =
        await this.authRepository
            .findLatestOtp(

                user.id,

                OtpType
                    .EMAIL_VERIFICATION,

            );


    if (
        lastOtp
        &&
        !OtpService.canResend(
            lastOtp.createdAt,
        )
    ) {

        const remainingSeconds =
            OtpService
                .getRemainingCooldownSeconds(
                    lastOtp.createdAt,
                );


        throw new AppError(
            `Please wait ${remainingSeconds} seconds before requesting another OTP`,
            429,
        );
    }


    /*
     * Invalidate previous OTPs.
     */
    await this.authRepository
        .invalidateOtps(

            user.id,

            OtpType
                .EMAIL_VERIFICATION,

        );


    const otp =
        OtpService.generate();


    const otpHash =
        await OtpService.hash(
            otp,
        );


    await this.authRepository
        .createOtp({

            userId:
                user.id,

            codeHash:
                otpHash,

            type:
                OtpType
                    .EMAIL_VERIFICATION,

            expiresAt:
                OtpService
                    .getExpirationDate(),

        });


    await this.authRepository
        .createAuthenticationLog({

            userId:
                user.id,

            action:
                AuthenticationAction
                    .RESEND_OTP,

            success:
                true,

            ipAddress:
                context.ipAddress ?? null,

            userAgent:
                context.userAgent ?? null,

            message:
                'Email verification OTP resent',

        });


    await MailService
        .sendVerificationOtp(
            user.email,
            otp,
        );


    return {
        email:
            user.email,
    };
}
}