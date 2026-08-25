import type {
    Prisma,
    User,
} from "../../../generated/prisma/client.js";
export class UserResource {

    static make(
        user: User,
    ) {

        return {
            id: user.id,

            nameEn: user.name_en,

            nameAr: user.name_ar,

            email: user.email,

            roleId: user.role,

            // emailVerifiedAt:
            //     user.email_verified_at,

            createdAt:
                user.createdAt,

            updatedAt:
                user.updatedAt,
        };
    }

    static collection(
        users: User[],
    ) {

        return users.map(
            (user) =>
                UserResource.make(user),
        );
    }
}