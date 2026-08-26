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

import { verifyEmailRequest } from './requests/verify-email.request.js';
import { resendOtpRequest } from './requests/resend-otp.request.js';
import { loginRequest } from './requests/login.request.js';
import { authenticate } from '../../shared/middleware/authenticate.middleware.js';

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

    /**
     * @openapi
     * /auth/verify-email:
     *   post:
     *     tags:
     *       - Authentication
     *     summary: Verify user email
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - otp
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: doctor@example.com
     *               otp:
     *                 type: string
     *                 example: "123456"
     *     responses:
     *       200:
     *         description: Email verified successfully
     *       400:
     *         description: Invalid or expired OTP
     */
    router.post(
        '/verify-email',

        validate(
            verifyEmailRequest,
        ),

        authController.verifyEmail,
    );

    /**
     * @openapi
     * /auth/resend-otp:
     *   post:
     *     tags:
     *       - Authentication
     *     summary: Resend email verification OTP
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: doctor@example.com
     *     responses:
     *       200:
     *         description: OTP sent successfully
     *       429:
     *         description: OTP resend cooldown
     */
    router.post(
        '/resend-otp',

        validate(
            resendOtpRequest,
        ),

        authController.resendOtp,
    );


    /**
     * @openapi
     * /auth/login:
     *   post:
     *     tags:
     *       - Authentication
     *     summary: Login
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: doctor@example.com
     *               password:
     *                 type: string
     *                 example: Password123!
     *     responses:
     *       200:
     *         description: Login successful
     *       401:
     *         description: Invalid credentials
     *       403:
     *         description: Email not verified
     */
    router.post(
        '/login',

        validate(
            loginRequest,
        ),

        authController.login,
    );
    /**
     * @openapi
     * /auth/me:
     *   get:
     *     tags:
     *       - Authentication
     *     summary: Get authenticated user
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: User information retrieved successfully
     *       401:
     *         description: Unauthenticated
     */
    router.get(
        '/me',

        authenticate,

        authController.me,
    );

export default router;