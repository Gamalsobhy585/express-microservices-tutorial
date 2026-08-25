import type { CreateUserDto } from '../dto/create-user.dto.js';
import type { UpdateUserDto } from '../dto/update-user.dto.js';

import type { IUserRepository } from '../repositories/user.repository.interface.js';

import { PasswordUtil } from '../../../shared/utils/password.util.js';
import { AppError } from '../../../shared/errors/AppError.js';

export class UserService {

    constructor(
        private readonly userRepository: IUserRepository,
    ) {}

    async getUsers() {

        return this.userRepository.findAll();
    }

    async getUserById(
        id: number,
    ) {

        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new AppError(
                'User not found',
                404,
            );
        }

        return user;
    }

    async createUser(
        dto: CreateUserDto,
    ) {

        const existingUser =
            await this.userRepository.findByEmail(
                dto.email,
            );

        if (existingUser) {
            throw new AppError(
                'Email already exists',
                409,
            );
        }

        const hashedPassword =
            await PasswordUtil.hash(
                dto.password,
            );

        return this.userRepository.create({
            ...dto,

            password: hashedPassword,
        });
    }

    async updateUser(
        id: number,
        dto: UpdateUserDto,
    ) {

        const user =
            await this.userRepository.findById(id);

        if (!user) {
            throw new AppError(
                'User not found',
                404,
            );
        }

        if (
            dto.email &&
            dto.email !== user.email
        ) {

            const existingUser =
                await this.userRepository.findByEmail(
                    dto.email,
                );

            if (existingUser) {
                throw new AppError(
                    'Email already exists',
                    409,
                );
            }
        }

        return this.userRepository.update(
            id,
            dto,
        );
    }

    async deleteUser(
        id: number,
    ) {

        const user =
            await this.userRepository.findById(id);

        if (!user) {
            throw new AppError(
                'User not found',
                404,
            );
        }

        return this.userRepository.delete(id);
    }
}