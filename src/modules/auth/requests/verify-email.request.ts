import { z } from 'zod';

export const verifyEmailRequest =
    z.object({

        body: z.object({

            email:
                z
                    .string()
                    .trim()
                    .email(
                        'Invalid email address',
                    )
                    .toLowerCase(),

            otp:
                z
                    .string()
                    .trim()
                    .length(
                        6,
                        'OTP must contain 6 digits',
                    )
                    .regex(
                        /^\d{6}$/,
                        'OTP must contain digits only',
                    ),

        }),

    });


export type VerifyEmailRequest =
    z.infer<
        typeof verifyEmailRequest
    >['body'];