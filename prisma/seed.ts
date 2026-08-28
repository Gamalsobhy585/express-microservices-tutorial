import 'dotenv/config';
import {
    PrismaClient,
} from '../src/generated/prisma/client.js';

import {
    PrismaPg,
} from '@prisma/adapter-pg';

import bcrypt from 'bcrypt';

const connectionString =
    process.env.DATABASE_URL;

if (!connectionString) {

    throw new Error(
        'DATABASE_URL is not defined',
    );
}


const adapter =
    new PrismaPg({
        connectionString,
    });


const prisma =
    new PrismaClient({
        
    });


const SALT_ROUNDS = 10;

const DEFAULT_PASSWORD = '123456';


const roles = [

    {
        name: 'admin',
        displayName: 'Administrator',
    },

    {
        name: 'doctor',
        displayName: 'Doctor',
    },

    {
        name: 'patient',
        displayName: 'Patient',
    },

];


const permissions = [

    {
        name: 'users.view',
        displayName: 'View Users',
    },

    {
        name: 'users.create',
        displayName: 'Create Users',
    },

    {
        name: 'users.update',
        displayName: 'Update Users',
    },

    {
        name: 'users.delete',
        displayName: 'Delete Users',
    },

    {
        name: 'roles.view',
        displayName: 'View Roles',
    },

    {
        name: 'roles.create',
        displayName: 'Create Roles',
    },

    {
        name: 'roles.update',
        displayName: 'Update Roles',
    },

    {
        name: 'roles.delete',
        displayName: 'Delete Roles',
    },

    {
        name: 'permissions.view',
        displayName: 'View Permissions',
    },

    {
        name: 'permissions.assign',
        displayName: 'Assign Permissions',
    },

];


const users = [

    {
        name_en: 'Admin',
        name_ar: 'مدير',
        email: 'admin@example.com',
        roleName: 'admin',
    },

    {
        name_en: 'Doctor',
        name_ar: 'طبيب',
        email: 'doctor@example.com',
        roleName: 'doctor',
    },

    {
        name_en: 'Patient',
        name_ar: 'مريض',
        email: 'patient@example.com',
        roleName: 'patient',
    },

];


async function main() {

    /*
    |--------------------------------------------------------------------------
    | Roles
    |--------------------------------------------------------------------------
    */

    for (
        const role of roles
    ) {

        await prisma.role.upsert({

            where: {
                name:
                    role.name,
            },

            update: {
                displayName:
                    role.displayName,
            },

            create:
                role,

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Permissions
    |--------------------------------------------------------------------------
    */

    for (
        const permission of permissions
    ) {

        await prisma.permission.upsert({

            where: {
                name:
                    permission.name,
            },

            update: {
                displayName:
                    permission.displayName,
            },

            create:
                permission,

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Give Admin All Permissions
    |--------------------------------------------------------------------------
    */

    const adminRole =
        await prisma.role.findUnique({

            where: {
                name:
                    'admin',
            },

        });


    if (!adminRole) {

        throw new Error(
            'Admin role not found',
        );

    }


    const allPermissions =
        await prisma.permission.findMany();


    for (
        const permission
        of allPermissions
    ) {

        await prisma.rolePermission.upsert({

            where: {

                roleId_permissionId: {

                    roleId:
                        adminRole.id,

                    permissionId:
                        permission.id,

                },

            },

            update: {},

            create: {

                roleId:
                    adminRole.id,

                permissionId:
                    permission.id,

            },

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Users
    |--------------------------------------------------------------------------
    */

    const hashedPassword =
        await bcrypt.hash(
            DEFAULT_PASSWORD,
            SALT_ROUNDS,
        );


    for (
        const userData of users
    ) {

        const role =
            await prisma.role.findUnique({

                where: {
                    name:
                        userData.roleName,
                },

            });


        if (!role) {

            throw new Error(
                `Role "${userData.roleName}" not found`,
            );

        }


        const user =
            await prisma.user.upsert({

                where: {
                    email:
                        userData.email,
                },

                update: {},

                create: {

                    name_en:
                        userData.name_en,

                    name_ar:
                        userData.name_ar,

                    email:
                        userData.email,

                    password:
                        hashedPassword,

                    emailVerifiedAt:
                        new Date(),

                    isActive:
                        true,

                },

            });


        await prisma.userRole.upsert({

            where: {

                userId_roleId: {

                    userId:
                        user.id,

                    roleId:
                        role.id,

                },

            },

            update: {},

            create: {

                userId:
                    user.id,

                roleId:
                    role.id,

            },

        });


        console.log(
            `Seeded user: ${userData.email} (${userData.roleName})`,
        );

    }


    console.log(
        'Database seeded successfully.',
    );

}


main()

    .catch(
        (error) => {

            console.error(
                error,
            );

            process.exit(1);

        },
    )

    .finally(
        async () => {

            await prisma.$disconnect();

        },
    );