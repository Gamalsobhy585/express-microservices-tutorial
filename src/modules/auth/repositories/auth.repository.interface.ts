import type {
    AuthenticationAction,
    OtpType,
    Role,
    User,
} from '../../../generated/prisma/client.js';

export interface RegisterUserTransactionData {

    user: CreateUserData;

    roleId: number;

    otp: CreateOtpData;

    log: Omit<
        CreateAuthenticationLogData,
        'userId'
    >;
}

export interface CreateUserData {
    name_en: string;

    name_ar: string;

    email: string;

    password: string;
}

export interface CreateOtpData {
    userId: number;

    codeHash: string;

    type: OtpType;

    expiresAt: Date;
}

export interface CreateAuthenticationLogData {
    userId?: number | null;

    action: AuthenticationAction;

    success?: boolean;

    ipAddress?: string | null;

    userAgent?: string | null;

    message?: string | null;
}

export interface IAuthRepository {

    findUserByEmail(
        email: string,
    ): Promise<User | null>;


    findRoleByName(
        name: string,
    ): Promise<Role | null>;


    createUser(
        data: CreateUserData,
    ): Promise<User>;


    attachRoleToUser(
        userId: number,
        roleId: number,
    ): Promise<void>;


    createOtp(
        data: CreateOtpData,
    ): Promise<void>;
    registerUser(
        userData: CreateUserData,
        roleId: number,
        otpCodeHash: string,
        otpExpiresAt: Date,
        log: Omit<
            CreateAuthenticationLogData,
            'userId'
        >,
    ): Promise<User>;

    createAuthenticationLog(
        data: CreateAuthenticationLogData,
    ): Promise<void>;
}