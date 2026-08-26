import type {
    AuthenticationAction,
    Role,
    User,
} from '../../../generated/prisma/client.js';
import  {
   OtpType
} from '../../../generated/prisma/client.js';


import {
    prisma,
} from '../../../config/database.js';

import type {
    CreateAuthenticationLogData,
    CreateOtpData,
    CreateUserData,
    IAuthRepository,
} from './auth.repository.interface.js';

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
}