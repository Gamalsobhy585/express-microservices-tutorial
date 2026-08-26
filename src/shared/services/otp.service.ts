import crypto from 'crypto';

import {
    PasswordUtil,
} from '../utils/password.util.js';


export class OtpService {

    static generate(): string {

        return crypto
            .randomInt(
                100000,
                1000000,
            )
            .toString();
    }


    static async hash(
        otp: string,
    ): Promise<string> {

        return PasswordUtil.hash(
            otp,
        );
    }


    static async verify(
        otp: string,
        hashedOtp: string,
    ): Promise<boolean> {

        return PasswordUtil.compare(
            otp,
            hashedOtp,
        );
    }


    static getExpirationDate(): Date {

        const minutes =
            Number(
                process.env
                    .OTP_EXPIRES_IN_MINUTES
                ?? 10,
            );


        return new Date(
            Date.now()
            +
            minutes
            *
            60
            *
            1000,
        );
    }


    static getResendCooldownSeconds(): number {

        return Number(
            process.env
                .OTP_RESEND_COOLDOWN_SECONDS
            ?? 60,
        );
    }


    static canResend(
        lastOtpCreatedAt: Date,
    ): boolean {

        const cooldown =
            this.getResendCooldownSeconds();


        const nextAllowedAt =
            lastOtpCreatedAt.getTime()
            +
            cooldown
            *
            1000;


        return Date.now()
            >= nextAllowedAt;
    }


    static getRemainingCooldownSeconds(
        lastOtpCreatedAt: Date,
    ): number {

        const cooldown =
            this.getResendCooldownSeconds();


        const nextAllowedAt =
            lastOtpCreatedAt.getTime()
            +
            cooldown
            *
            1000;


        const remaining =
            nextAllowedAt
            -
            Date.now();


        if (
            remaining <= 0
        ) {

            return 0;
        }


        return Math.ceil(
            remaining / 1000,
        );
    }
}