import { z } from 'zod';

export const resendOtpRequest =
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

        }),

    });


export type ResendOtpRequest =
    z.infer<
        typeof resendOtpRequest
    >['body'];