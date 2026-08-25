import {
    Router,
} from 'express';

import {
    UserRepository,
} from './repositories/user.repository.js';

import {
    UserService,
} from './services/user.service.js';

import {
    UserController,
} from './controllers/user.controller.js';

import {
    validate,
} from '../../shared/middleware/validate.middleware.js';

import {
    createUserRequest,
} from './requests/create-user.request.js';

import {
    updateUserRequest,
} from './requests/update-user.request.js';
import { userIdRequest } from './requests/user-id.request.js';


const router = Router();


/*
|--------------------------------------------------------------------------
| Dependencies
|--------------------------------------------------------------------------
*/

const userRepository =
    new UserRepository();

const userService =
    new UserService(
        userRepository,
    );

const userController =
    new UserController(
        userService,
    );


/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */


router.get(
    '/',
    userController.index,
);
/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 */
router.get(
    '/:id',

    validate(
        userIdRequest,
    ),

    userController.show,
);

/**
 * @openapi
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nameEn
 *               - nameAr
 *               - email
 *               - password
 *               - roleId
 *             properties:
 *               nameEn:
 *                 type: string
 *                 example: Ahmed Ali
 *               nameAr:
 *                 type: string
 *                 example: أحمد علي
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ahmed@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *               roleId:
 *                 type: integer
 *                 enum:
 *                   - 1
 *                   - 2
 *                   - 3
 *                 example: 2
 *     responses:
 *       201:
 *         description: User created successfully
 *       422:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post(
    '/',
    validate(
        createUserRequest,
    ),
    userController.store,
);


/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nameEn:
 *                 type: string
 *               nameAr:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               roleId:
 *                 type: integer
 *                 enum:
 *                   - 1
 *                   - 2
 *                   - 3
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put(
    '/:id',

    validate(
        updateUserRequest,
    ),

    userController.update,
);


/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete(
    '/:id',

    validate(
        userIdRequest,
    ),

    userController.destroy,
);

export default router;