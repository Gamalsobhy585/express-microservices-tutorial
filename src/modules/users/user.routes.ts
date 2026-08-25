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

router.get(
    '/',
    userController.index,
);

router.get(
    '/:id',

    validate(
        userIdRequest,
    ),

    userController.show,
);


router.post(
    '/',
    validate(
        createUserRequest,
    ),
    userController.store,
);


router.put(
    '/:id',
    validate(
        updateUserRequest,
    ),
    userController.update,
);


router.delete(
    '/:id',

    validate(
        userIdRequest,
    ),

    userController.destroy,
);

export default router;