import { z } from 'zod';

import { RoleEnum } from '../../users/enums/role.enum.js';

export const registerRequest = z.object({
    body: z.object({
        name_en: z
            .string()
            .trim()
            .min(
                2,
                'English name must be at least 2 characters',
            )
            .max(255),

        name_ar: z
            .string()
            .trim()
            .min(
                2,
                'Arabic name must be at least 2 characters',
            )
            .max(255),

        email: z
            .string()
            .trim()
            .email(
                'Invalid email address',
            )
            .toLowerCase(),

        password: z
            .string()
            .min(
                8,
                'Password must be at least 8 characters',
            )
            .max(100),

        role: z.nativeEnum(
            RoleEnum,
        ),
    }),
});

export type RegisterRequest =
    z.infer<
        typeof registerRequest
    >['body'];