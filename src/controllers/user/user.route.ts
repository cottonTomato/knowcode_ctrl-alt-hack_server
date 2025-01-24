import { Router } from 'express';
import { validatorFactory } from '../../middlewares/validator.middleware';
import { userOnbordingDto } from './user.dto';
import { addUserHandler } from './user.controller';

export const userRouter = Router();

userRouter.post('/', validatorFactory(userOnbordingDto), addUserHandler);
