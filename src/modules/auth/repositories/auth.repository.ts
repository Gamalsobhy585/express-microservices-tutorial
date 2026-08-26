import type {
    AuthenticationAction,
    Role,
    User,
    RefreshToken,
    
} from '../../../generated/prisma/client.js';
import  {
   OtpType
} from '../../../generated/prisma/client.js';
 import type  { CreateRefreshTokenData,UserWithRoles } from './auth.repository.interface.js';

import {
    prisma,
} from '../../../config/database.js';

import type {
    CreateAuthenticationLogData,
    CreateOtpData,
    CreateUserData,
    IAuthRepository,
} from './auth.repository.interface.js';

import type { Otp } from '../../../generated/prisma/client.js';

export class AuthRepository implements IAuthRepository {

    async findUserByEmail(
        email: string,
    ): Promise<User | null> {

        return prisma.user.findUnique({
            where: {
                email,
            },
        });
    }


    async findRoleByName(
        name: string,
    ): Promise<Role | null> {

        return prisma.role.findUnique({
            where: {
                name,
            },
        });
    }

async registerUser(
    userData: CreateUserData,
    roleId: number,
    otpCodeHash: string,
    otpExpiresAt: Date,
    log: Omit<
        CreateAuthenticationLogData,
        'userId'
    >,
): Promise<User> {

    return prisma.$transaction(
        async (
            transaction,
        ) => {

            const user =
                await transaction.user.create({
                    data:
                        userData,
                });


            await transaction.userRole.create({

                data: {

                    userId:
                        user.id,

                    roleId,
                },
            });


            await transaction.otp.create({

                data: {

                    userId:
                        user.id,

                    codeHash:
                        otpCodeHash,

                    type:
                        OtpType
                            .EMAIL_VERIFICATION,

                    expiresAt:
                        otpExpiresAt,
                },
            });


            await transaction
                .authenticationLog
                .create({

                    data: {

                        userId:
                            user.id,

                        action:
                            log.action,

                        success:
                            log.success
                            ?? true,

                        ipAddress:
                            log.ipAddress
                            ?? null,

                        userAgent:
                            log.userAgent
                            ?? null,

                        message:
                            log.message
                            ?? null,
                    },
                });


            return user;
        },
    );
}
    async createUser(
        data: CreateUserData,
    ): Promise<User> {

        return prisma.user.create({
            data,
        });
    }


    async attachRoleToUser(
        userId: number,
        roleId: number,
    ): Promise<void> {

        await prisma.userRole.create({
            data: {
                userId,
                roleId,
            },
        });
    }


    async createOtp(
        data: CreateOtpData,
    ): Promise<void> {

        await prisma.otp.create({
            data: {
                userId:
                    data.userId,

                codeHash:
                    data.codeHash,

                type:
                    data.type as OtpType,

                expiresAt:
                    data.expiresAt,
            },
        });
    }


    async createAuthenticationLog(
        data: CreateAuthenticationLogData,
    ): Promise<void> {

        await prisma.authenticationLog.create({
            data: {
                userId:
                    data.userId ?? null,

                action:
                    data.action as AuthenticationAction,

                success:
                    data.success ?? true,

                ipAddress:
                    data.ipAddress ?? null,

                userAgent:
                    data.userAgent ?? null,

                message:
                    data.message ?? null,
            },
        });
    }
    async findLatestValidOtp(
        userId: number,
        type: OtpType,
    ): Promise<Otp | null> {

        return prisma.otp.findFirst({

            where: {

                userId,

                type,

                usedAt: null,

                expiresAt: {
                    gt:
                        new Date(),
                },

            },

            orderBy: {
                createdAt:
                    'desc',
            },

        });
    }
    async findUserWithRoles(
        userId: number,
    ): Promise<UserWithRoles | null> {

        return prisma.user.findUnique({

            where: {
                id:
                    userId,
            },

            include: {

                userRoles: {

                    include: {
                        role:
                            true,
                    },

                },

            },

        });
    }
    async createRefreshToken(
        data: CreateRefreshTokenData,
    ): Promise<RefreshToken> {

        return prisma.refreshToken.create({

            data: {

                userId:
                    data.userId,

                tokenHash:
                    data.tokenHash,

                expiresAt:
                    data.expiresAt,

            },

        });
    }
    async findLatestOtp(
        userId: number,
        type: OtpType,
    ): Promise<Otp | null> {

        return prisma.otp.findFirst({

            where: {
                userId,
                type,
            },

            orderBy: {
                createdAt:
                    'desc',
            },

        });
    }

    async invalidateOtps(
        userId: number,
        type: OtpType,
    ): Promise<void> {

        await prisma.otp.updateMany({

            where: {

                userId,

                type,

                usedAt: null,

            },

            data: {

                usedAt:
                    new Date(),

            },

        });
    }
    async verifyEmail(
        userId: number,
        otpId: number,
    ): Promise<User> {

        return prisma.$transaction(
            async (
                transaction,
            ) => {

                const user =
                    await transaction.user.update({

                        where: {
                            id:
                                userId,
                        },

                        data: {

                            emailVerifiedAt:
                                new Date(),

                        },

                    });


                await transaction.otp.update({

                    where: {
                        id:
                            otpId,
                    },

                    data: {

                        usedAt:
                            new Date(),

                    },

                });


                /*
                * Invalidate any other outstanding
                * email verification OTP.
                */
                await transaction.otp.updateMany({

                    where: {

                        userId,

                        type:
                            OtpType
                                .EMAIL_VERIFICATION,

                        usedAt: null,

                    },

                    data: {

                        usedAt:
                            new Date(),

                    },

                });


                return user;
            },
        );
    }

}