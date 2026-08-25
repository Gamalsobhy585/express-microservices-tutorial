import { z } from 'zod';
import { RoleEnum } from "../enums/role.enum.js";

export const createUserRequest = z.object({
    body: z.object({
        nameEn: z
            .string()
            .trim()
            .min(2, 'English name must be at least 2 characters')
            .max(255, 'English name cannot exceed 255 characters'),

        nameAr: z
            .string()
            .trim()
            .min(2, 'Arabic name must be at least 2 characters')
            .max(255, 'Arabic name cannot exceed 255 characters'),

        email: z
            .string()
            .trim()
            .email('Invalid email address')
            .toLowerCase(),

        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .max(100, 'Password cannot exceed 100 characters'),

        roleId: z.nativeEnum(RoleEnum),
    }),
});

export type CreateUserRequest = z.infer<
    typeof createUserRequest
>['body'];