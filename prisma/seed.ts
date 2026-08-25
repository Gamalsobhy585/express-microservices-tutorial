import 'dotenv/config';
import {
    PrismaClient,
} from '../src/generated/prisma/client.js';


import {
    PrismaPg,
} from '@prisma/adapter-pg';


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
        adapter,
    });


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