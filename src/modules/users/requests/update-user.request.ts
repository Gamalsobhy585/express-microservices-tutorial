import { z } from 'zod';
import { RoleEnum } from '../enums/role.enum.js';

export const updateUserRequest = z.object({
    params: z.object({
        id: z.coerce.number().int().positive(),
    }),

    body: z.object({
        name_en: z
            .string()
            .trim()
            .min(2)
            .max(255)
            .optional(),

        name_ar: z
            .string()
            .trim()
            .min(2)
            .max(255)
            .optional(),

        email: z
            .string()
            .trim()
            .email()
            .toLowerCase()
            .optional(),

        roleId: z
            .nativeEnum(RoleEnum)
            .optional(),
    }),
});

export type UpdateUserRequest = z.infer<
    typeof updateUserRequest
>['body'];