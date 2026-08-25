import type { RoleEnum } from '../enums/role.enum.ts';

export interface UpdateUserDto {
    nameEn?: string;

    nameAr?: string;

    email?: string;

    roleId?: RoleEnum;
}