import type {
    Request,
    Response,
    NextFunction,
} from 'express';

import { UserService } from '../services/user.service.js';

import { UserResource } from '../resources/user.resource.js';

import type { CreateUserDto } from '../dto/create-user.dto.js';

import type { UpdateUserDto } from '../dto/update-user.dto.js';
import { RoleEnum } from '../enums/role.enum.js';

export class UserController {

    constructor(
        private readonly userService: UserService,
    ) {}

    index = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {

        try {

            const users =
                await this.userService.getUsers();

            return res.status(200).json({
                success: true,

                message:
                    'Users retrieved successfully',

                data:
                    UserResource.collection(
                        users,
                    ),
            });

        } catch (error) {

            next(error);

        }
    };

    show = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {

        try {

            const id =
                Number(req.params.id);

            const user =
                await this.userService.getUserById(
                    id,
                );

            return res.status(200).json({
                success: true,

                message:
                    'User retrieved successfully',

                data:
                    UserResource.make(
                        user,
                    ),
            });

        } catch (error) {

            next(error);

        }
    };

    store = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {

        try {

            const dto: CreateUserDto = {
                name_en: req.body.name_en,

                name_ar: req.body.name_ar,

                email: req.body.email,

                password: req.body.password,
                role: RoleEnum.ADMIN
            };

            const user =
                await this.userService.createUser(
                    dto,
                );

            return res.status(201).json({
                success: true,

                message:
                    'User created successfully',

                data:
                    UserResource.make(
                        user,
                    ),
            });

        } catch (error) {

            next(error);

        }
    };

    update = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {

        try {

            const id =
                Number(req.params.id);

            const dto: UpdateUserDto = {
                name_en:
                    req.body.name_en,

                name_ar:
                    req.body.name_ar,

                email:
                    req.body.email,

              
            };

            const user =
                await this.userService.updateUser(
                    id,
                    dto,
                );

            return res.status(200).json({
                success: true,

                message:
                    'User updated successfully',

                data:
                    UserResource.make(
                        user,
                    ),
            });

        } catch (error) {

            next(error);

        }
    };

    destroy = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {

        try {

            const id =
                Number(req.params.id);

            await this.userService.deleteUser(
                id,
            );

            return res.status(200).json({
                success: true,

                message:
                    'User deleted successfully',
            });

        } catch (error) {

            next(error);

        }
    };
}