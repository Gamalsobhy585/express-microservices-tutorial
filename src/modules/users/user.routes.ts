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
import { authenticate } from '../../shared/middleware/authenticate.middleware.js';
import { authorize } from '../../shared/middleware/authorize.middleware.js';


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

    router.use(authenticate, authorize('admin'));

router.get('/', userController.index);
router.get('/:id', validate(userIdRequest), userController.show);
router.post('/', validate(createUserRequest), userController.store);
router.put('/:id', validate(updateUserRequest), userController.update);
router.delete('/:id', validate(userIdRequest), userController.destroy);


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
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name_en
 *               - name_ar
 *               - email
 *               - password
 *               - roleId
 *             properties:
 *               name_en:
 *                 type: string
 *                 example: Sarah Ahmed
 *               name_ar:
 *                 type: string
 *                 example: سارة أحمد
 *               email:
 *                 type: string
 *                 format: email
 *                 example: sarah.doctor@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *               roleId:
 *                 type: integer
 *                 description: "ID of an existing role (see roles table — e.g. admin, doctor, patient)"
 *                 example: 2
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 success: true
 *                 message: User created successfully
 *                 data:
 *                   id: 4
 *                   name_en: Sarah Ahmed
 *                   name_ar: سارة أحمد
 *                   email: sarah.doctor@example.com
 *                   isActive: true
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Authenticated user does not have the admin role
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
 *               name_en:
 *                 type: string
 *               name_ar:
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