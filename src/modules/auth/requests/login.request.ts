import { z } from 'zod';

export const loginRequest =
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

            password:
                z
                    .string()
                    .min(
                        1,
                        'Password is required',
                    ),

        }),

    });


export type LoginRequest =
    z.infer<
        typeof loginRequest
    >['body'];