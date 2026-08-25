import type {
    Prisma,
    User,
} from "../../../generated/prisma/client.js";

import { prisma } from '../../../config/database.js';

import type { CreateUserDto } from '../dto/create-user.dto.js';
import type { UpdateUserDto } from '../dto/update-user.dto.js';

import type  { IUserRepository } from './user.repository.interface.js';

export class UserRepository implements IUserRepository {

    async findAll(): Promise<User[]> {

        return prisma.user.findMany({
            orderBy: {
                id: 'desc',
            },
        });
    }

    async findById(
        id: number,
    ): Promise<User | null> {

        return prisma.user.findUnique({
            where: {
                id,
            },
        });
    }

    async findByEmail(
        email: string,
    ): Promise<User | null> {

        return prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async create(
        data: CreateUserDto,
    ): Promise<User> {

        return prisma.user.create({
            data: {
                nameEn: data.nameEn,

                nameAr: data.nameAr,

                email: data.email,

                password: data.password,

                roleId: data.roleId,
            },
        });
    }

    async update(
        id: number,
        data: UpdateUserDto,
    ): Promise<User> {

        return prisma.user.update({
            where: {
                id,
            },

            data,
        });
    }

    async delete(
        id: number,
    ): Promise<User> {

        return prisma.user.delete({
            where: {
                id,
            },
        });
    }
}