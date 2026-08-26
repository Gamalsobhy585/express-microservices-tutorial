import { RoleEnum } from '../../users/enums/role.enum.js';

export interface RegisterDto {
    name_en: string;

    name_ar: string;

    email: string;

    password: string;

    role: RoleEnum;
}