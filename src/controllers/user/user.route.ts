import { Router } from 'express';
import { requireAuth } from '../../middlewares';
import { onBoardUser, getMonthlyContributions } from './user.controller';

export const userRouter = Router();
userRouter.use(requireAuth);

userRouter.post('/onboard', onBoardUser);
userRouter.get('/monthly-contributions', getMonthlyContributions);
