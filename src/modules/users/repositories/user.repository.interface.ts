import type { UserModel as User } from "../../../generated/prisma/models/User.js";
import type { CreateUserDto } from '../dto/create-user.dto.js';
import type { UpdateUserDto } from '../dto/update-user.dto.js';
export interface CreateUserRepositoryData {

    nameEn: string;

    nameAr: string;

    email: string;

    password: string;

}
export interface IUserRepository {

    findAll(): Promise<User[]>;

    findById(id: number): Promise<User | null>;

    findByEmail(email: string): Promise<User | null>;

    create(
        data: CreateUserDto,
    ): Promise<User>;

    update(
        id: number,
        data: UpdateUserDto,
    ): Promise<User>;

    delete(
        id: number,
    ): Promise<User>;
}