import type { NextFunction, Request, Response } from 'express';
import { AuthRepository } from '../../modules/auth/repositories/auth.repository.js';
import { AppError } from '../errors/AppError.js';

const authRepository = new AuthRepository();

export function authorize(...allowedRoles: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new AppError('Authentication required', 401);
            }

            const userWithRoles = await authRepository.findUserWithRoles(req.user.id);

            if (!userWithRoles) {
                throw new AppError('User not found', 404);
            }

            const userRoleNames = userWithRoles.userRoles.map((ur) => ur.role.name);

            const isAuthorized = allowedRoles.some((role) =>
                userRoleNames.includes(role),
            );

            if (!isAuthorized) {
                throw new AppError(
                    'You do not have permission to perform this action',
                    403,
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}