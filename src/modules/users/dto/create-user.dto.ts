import {
    RoleEnum,
} from '../enums/role.enum.js';

export interface CreateUserDto {

    name_en: string;

    name_ar: string;

    email: string;

    password: string;

    role: RoleEnum;

}