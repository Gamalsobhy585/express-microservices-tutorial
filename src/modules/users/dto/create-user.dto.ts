import { RoleEnum } from '../enums/role.enum.js';

export interface CreateUserDto {
    nameEn: string;

    nameAr: string;

    email: string;

    password: string;

    roleId: RoleEnum;
}