import  {
    AuthenticationAction,
    OtpType,
} from '../../../generated/prisma/client.js';

import type {
    RegisterDto,
} from '../dto/register.dto.js';

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
}