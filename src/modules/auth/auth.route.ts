import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { loginSchema, registerSchema } from './auth.validation';
import { loginUser, register, viewProfileUser } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post(
  '/addUser',
  validate(registerSchema),
  /*  #swagger.tags = ['Auth']
      #swagger.summary = 'Register a new user'
      #swagger.requestBody = {
            required: true,
            schema: { $ref: "#/components/schemas/RegisterSchema" }
      }
      #swagger.responses[201] = { description: 'User registered successfully' }
  */
  register,
);

router.post(
  '/login',
  validate(loginSchema),
  /*  #swagger.tags = ['Auth']
      #swagger.summary = 'Log in an existing user'
      #swagger.requestBody = {
            required: true,
            schema: { $ref: "#/components/schemas/LoginSchema" }
      }
      #swagger.responses[200] = { description: 'Login successful' }
  */
  loginUser,
);

router.get(
  '/viewProfile',
  authenticate,
  /*  #swagger.tags = ['Auth']
      #swagger.summary = 'View user profile'
      #swagger.security = [{ bearerAuth: [] }]
      #swagger.responses[200] = { description: 'Profile fetched successfully' }
  */
  viewProfileUser,
);

export default router;
