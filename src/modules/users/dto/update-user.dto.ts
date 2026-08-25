import type { RoleEnum } from '../enums/role.enum.js';

export interface UpdateUserDto {
    name_en?: string;

    name_ar?: string;

    email?: string;

    roleId?: RoleEnum;
}