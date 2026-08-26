import {
    Router,
} from 'express';

import {
    AuthRepository,
} from './repositories/auth.repository.js';

import {
    AuthService,
} from './services/auth.service.js';

import {
    AuthController,
} from './controllers/auth.controller.js';

import {
    validate,
} from '../../shared/middleware/validate.middleware.js';

import {
    registerRequest,
} from './requests/register.request.js';


const router =
    Router();


/*
|--------------------------------------------------------------------------
| Dependencies
|--------------------------------------------------------------------------
*/

const authRepository =
    new AuthRepository();


const authService =
    new AuthService(
        authRepository,
    );


const authController =
    new AuthController(
        authService,
    );


/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/


/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register new user
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
 *               - role
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
 *               role:
 *                 type: string
 *                 enum:
 *                   - admin
 *                   - doctor
 *                   - patient
 *                 example: doctor
 *     responses:
 *       201:
 *         description: Registration successful
 *       409:
 *         description: Email already exists
 *       422:
 *         description: Validation failed
 */
router.post(
    '/register',

    validate(
        registerRequest,
    ),

    authController.register,
);


export default router;