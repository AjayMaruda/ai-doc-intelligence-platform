import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { loginSchema, registerSchema } from './auth.validation';
import { loginUser, register } from './auth.controller';

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

export default router;
