import type{
    User,
} from '../../../generated/prisma/client.js';

import type{
    UserWithRoles,
} from '../repositories/auth.repository.interface.js';


export class AuthResource {

    static registeredUser(
        user: User,
    ) {

        return {

            id:
                user.id,

            nameEn:
                user.name_en,

            nameAr:
                user.name_ar,

            email:
                user.email,

            emailVerifiedAt:
                user.emailVerifiedAt,

            isActive:
                user.isActive,

            createdAt:
                user.createdAt,

        };
    }


    static authenticatedUser(
        user: UserWithRoles,
    ) {

        return {

            id:
                user.id,

            nameEn:
                user.name_en,

            nameAr:
                user.name_ar,

            email:
                user.email,

            emailVerifiedAt:
                user.emailVerifiedAt,

            isActive:
                user.isActive,

            roles:
                user.userRoles.map(
                    (
                        userRole,
                    ) =>
                        userRole.role.name,
                ),

            createdAt:
                user.createdAt,

            updatedAt:
                user.updatedAt,

        };
    }
}