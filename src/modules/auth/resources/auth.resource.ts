import type {
    User,
} from '../../../generated/prisma/client.js';

export class AuthResource {

    static registeredUser(
        user: User,
    ) {

        return {
  

            nameEn:
                user.name_en,

            nameAr:
                user.name_ar,

            email:
                user.email,

            isActive:
                user.isActive,

            createdAt:
                user.createdAt,
        };
    }
}