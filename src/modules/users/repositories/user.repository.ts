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
                name_en: data.name_en,

                name_ar: data.name_ar,

                email: data.email,

                password: data.password,

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